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

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
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
