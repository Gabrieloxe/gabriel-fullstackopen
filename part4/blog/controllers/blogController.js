const blogRouter = require('express').Router();
const Blog = require('../models/Blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const data = request.body;
  const blogTemplate = {
    title: data.title,
    author: data.author,
    url: data.url,
    likes: data.likes || 0,
  };
  const blog = new Blog(blogTemplate);
  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogRouter;
