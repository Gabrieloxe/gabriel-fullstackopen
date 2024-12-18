const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const data = request.body;
  const user = request.user;
  const blog = new Blog({
    title: data.title,
    author: data.author,
    url: data.url,
    likes: data.likes || 0,
    user: user.id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  const user = request.user;
  const blog = await Blog.findById(id);
  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: 'log in as the user to delete the blog' });
  }
  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const data = request.body;
  const blog = {
    ...data,
    likes: data.likes || 0,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogRouter;
