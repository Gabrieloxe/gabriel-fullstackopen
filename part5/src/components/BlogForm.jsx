import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ addBlog, user }) => {
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
      <div>
        <label>
          Title
          <input
            type='text'
            value={newBlog.title}
            name='title'
            onChange={handleNewBlogChange}
          />
        </label>
      </div>
      <div>
        <label>
          Author
          <input
            type='text'
            value={newBlog.author}
            name='author'
            onChange={handleNewBlogChange}
          />
        </label>
      </div>
      <div>
        <label>
          URL
          <input
            type='text'
            value={newBlog.url}
            name='url'
            onChange={handleNewBlogChange}
          />
        </label>
      </div>
      <button type='submit'>Create</button>
    </form>
  );
};

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
};

export default BlogForm;
