import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';
import { afterEach } from 'vitest';
import blogService from '../services/blogs';

describe('BlogForm', () => {
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    vi.spyOn(blogService, 'create').mockResolvedValue({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('calls the create blog handler with a valid blog detail', async () => {
    const user = userEvent.setup();
    render(<BlogForm addBlog={mockHandleSubmit} />);

    const titleInput = screen.getByRole('textbox', { name: /Title/i });
    await user.type(titleInput, 'Test Blog Title');

    const authorInput = screen.getByRole('textbox', { name: /Author/i });
    await user.type(authorInput, 'Test Author');

    const urlInput = screen.getByRole('textbox', { name: /URL/i });
    await user.type(urlInput, 'http://test.url');

    const submitButton = screen.getByRole('button', { name: /Create/i });
    await user.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    expect(mockHandleSubmit).toHaveBeenCalledWith({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://test.url',
    });
  });
});
