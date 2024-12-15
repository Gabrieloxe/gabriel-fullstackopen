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
      console.log('blog saved');
    }
    console.log('done');
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

  after(async () => {
    await mongoose.connection.close();
  });
});
