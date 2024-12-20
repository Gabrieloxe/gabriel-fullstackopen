import React, { useState } from 'react';

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  const handleNewBlogChange = ({ target }) => {
    setNewBlog({ ...newBlog, [target.name]: target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title,
      url: newBlog.url,
      author: newBlog.author,
    };
    addBlog(blogObject);
    setNewBlog({ title: '', author: '', url: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create new</h2>
      <div />
      <div>
        title
        <input
          type='text'
          value={newBlog.title}
          name='title'
          onChange={handleNewBlogChange}
        />
      </div>
      <div>
        author
        <input
          type='text'
          value={newBlog.author}
          name='author'
          onChange={handleNewBlogChange}
        />
      </div>
      <div>
        url
        <input
          type='text'
          value={newBlog.url}
          name='url'
          onChange={handleNewBlogChange}
        />
      </div>
      <button type='submit'>Create</button>
    </form>
  );
};

export default BlogForm;
