const { test, after, describe, beforeEach, before } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const { mockBlogs, mockUsers } = require('./sampleData');

let token;

describe('blog API tests', () => {
  before(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    for (let user of mockUsers) {
      await api.post('/api/users').send(user);
    }

    console.log('Created mock users');

    for (let blog of mockBlogs) {
      let user = await User.findOne({ name: blog.author });
      let blogObject = new Blog({ ...blog, user: user._id });
      user.blogs = user.blogs.concat(blogObject._id);
      await blogObject.save();
      await user.save();
    }

    console.log('Created mock blogs');

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'robert', password: 'robertpassword' })
      .expect('Content-Type', /application\/json/);

    token = loginResponse.body.token;

    console.log('Logged in as Robert');
  });

  beforeEach(async () => {
    // Any setup needed before each test
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('the unique identifier of the blogs is id', async () => {
    const { body: blogs } = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);
    blogs.forEach(blog => {
      assert(blog.id, 'Blog should have an id property');
      assert(!blog._id, 'Blog should not have an _id property');
    });
  });

  test('creating a new blog post', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Robert C. Martin',
      url: 'http://testblog.com',
      likes: 10,
    };
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      title: 'No likes blog',
      author: 'Robert C. Martin',
      url: 'http://test.com',
    };
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test('should return 400 Bad Request if title is missing', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://test.com',
      likes: 5,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('should delete a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart.find(
      b => b.author === 'Robert C. Martin'
    );

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

    const titles = blogsAtEnd.map(b => b.title);
    assert(!titles.includes(blogToDelete.title));
  });

  test('should update a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart.find(
      b => b.author === 'Robert C. Martin'
    );

    const updatedData = {
      title: 'Updated Blog',
      author: 'Robert C. Martin',
      url: 'http://updated.com',
      likes: 10,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updatedBlog = response.body;
    assert.strictEqual(updatedBlog.title, updatedData.title);
    assert.strictEqual(updatedBlog.author, updatedData.author);
    assert.strictEqual(updatedBlog.url, updatedData.url);
    assert.strictEqual(updatedBlog.likes, updatedData.likes);
  });

  test('should prevent deletion of blog if logged in as another user', async () => {
    const blogs = await helper.blogsInDb();
    const blogToDelete = blogs.find(b => b.author === 'Robert C. Martin');

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'michael', password: 'michaelpassword' })
      .expect('Content-Type', /application\/json/);

    token = loginResponse.body.token;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  test('should return unathorized if token is not provided', async () => {
    const blogs = await helper.blogsInDb();
    const blogToDelete = blogs[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
