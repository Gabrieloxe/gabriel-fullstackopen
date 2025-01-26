import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { expect } from 'chai';
import { afterEach, test } from 'vitest';
import blogService from '../services/blogs';

describe('Blog', () => {
  const mockHandleDelete = vi.fn();

  const blog = {
    id: 'testID',
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://test.url',
    likes: 0,
    user: {
      id: 'testUserID',
      name: 'Test User',
      username: 'testUsername',
    },
  };
  const user = {
    id: 'testUserID',
    name: 'Test User',
    username: 'testUsername',
  };

  beforeEach(() => {
    vi.spyOn(blogService, 'update').mockResolvedValue({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders the blog', () => {
    render(<Blog blog={blog} user={user} handleDelete={mockHandleDelete} />);
    expect(screen.getByText('Test Blog Title Test Author')).toBeDefined();
  });

  test('renders the blog details when expanded', async () => {
    const user = userEvent.setup();
    render(<Blog blog={blog} user={user} handleDelete={mockHandleDelete} />);
    const expandButton = screen.getByRole('button', { name: 'view' });
    await user.click(expandButton);
    expect(screen.getByText('http://test.url')).toBeDefined();
    expect(screen.getByText('likes 0')).toBeDefined();
    expect(screen.getByText('Test User')).toBeDefined();
  });

  test('clicking the like button calls updates the likes', async () => {
    const user = userEvent.setup();
    render(<Blog blog={blog} user={user} handleDelete={mockHandleDelete} />);
    const expandButton = screen.getByRole('button', { name: 'view' });
    await user.click(expandButton);
    const likeButton = screen.getByRole('button', { name: 'like' });
    await user.click(likeButton);
    await user.click(likeButton);
    expect(blogService.update).toHaveBeenCalledTimes(2);
    expect(screen.getByText('likes 2')).toBeDefined();
  });
});
