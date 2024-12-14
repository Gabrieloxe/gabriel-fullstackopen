const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const mockBlogs = require('./sampleData');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('totalLikes', () => {
  test('when 5 likes for the single blog', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const oneBlog = [mockBlogs[1]];
    console.log(oneBlog);
    const result = listHelper.totalLikes(oneBlog);
    assert.strictEqual(result, 5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(mockBlogs);
    assert.strictEqual(result, 36);
  });
});

describe('favoriteBlog', () => {
  test('when list has only one blog, it is the favorite', () => {
    const oneBlog = [mockBlogs[0]];
    const result = listHelper.favouriteBlog(oneBlog);
    const expected = {
      title: mockBlogs[0].title,
      author: mockBlogs[0].author,
      likes: mockBlogs[0].likes,
    };
    assert.deepStrictEqual(result, expected);
  });

  test('when list has multiple blogs, it returns the one with most likes', () => {
    const result = listHelper.favouriteBlog(mockBlogs);
    const expected = {
      title: 'Canonical string reduction', // Assuming this is the blog with most likes
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };
    assert.deepStrictEqual(result, expected);
  });

  test('when list is empty, it returns an empty object', () => {
    const result = listHelper.favouriteBlog([]);
    const expected = {};
    assert.deepStrictEqual(result, expected);
  });
});

describe('mostBlogs', () => {
  test('when list has multiple blogs, it returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(mockBlogs);
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3,
    };
    assert.deepStrictEqual(result, expected);
  });

  test('when list is empty, it returns an empty object', () => {
    const result = listHelper.mostBlogs([]);
    const expected = {};
    assert.deepStrictEqual(result, expected);
  });
});

describe('mostLikes', () => {
  test('when list has multiple blogs, it returns the author with most likes', () => {
    const result = listHelper.mostLikes(mockBlogs);
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };
    assert.deepStrictEqual(result, expected);
  });

  test('when list is empty, it returns an empty object', () => {
    const result = listHelper.mostLikes([]);
    const expected = {};
    assert.deepStrictEqual(result, expected);
  });
});
