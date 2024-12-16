const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/Blog');
const mockBlogs = require('./sampleData');

describe('blog API tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    console.log('cleared');

    for (let blog of mockBlogs) {
      let blogObject = new Blog(blog);
      await blogObject.save();
    }
    console.log('test blogs repopulated');
  });

  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('the unique identifier of the blogs is id', async () => {
    const { body: blogs } = await api.get('/api/blogs');
    blogs.forEach(blog => {
      assert(blog.id, 'Blog should have an id property');
      assert(!blog._id, 'Blog should not have an _id property');
    });
  });

  test('creating a new blog post', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'http://test.com',
      likes: 10,
    };
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.title, newBlog.title);
    assert.strictEqual(response.body.author, newBlog.author);
    assert.strictEqual(response.body.url, newBlog.url);
    assert.strictEqual(response.body.likes, newBlog.likes);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, mockBlogs.length + 1);
  });

  test('creating a new blog post without likes defaults to 0', async () => {
    const newBlog = {
      title: 'Test no likes blog',
      author: 'Test no likes author',
      url: 'http://test.com',
    };
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test('should return 400 Bad Request if title is missing', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('should return 400 Bad Request if url is missing', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('should delete a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

    const titles = blogsAtEnd.map(b => b.title);
    assert(!titles.includes(blogToDelete.title));
  });

  test('should update a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      title: 'Updated Blog',
      author: 'Updated Author',
      url: 'http://updated.com',
      likes: 10,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updatedBlog = response.body;
    assert.strictEqual(updatedBlog.title, updatedData.title);
    assert.strictEqual(updatedBlog.author, updatedData.author);
    assert.strictEqual(updatedBlog.url, updatedData.url);
    assert.strictEqual(updatedBlog.likes, updatedData.likes);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
