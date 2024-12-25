import React, { useState } from 'react';
import blogService from '../services/blogs';
import PropTypes from 'prop-types';

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
};

const Blog = ({ blog, handleDelete, user }) => {
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const handleLike = () => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    blogService.update(blog.id, {
      url: blog.url,
      title: blog.title,
      author: blog.author,
      likes: updatedLikes,
      user: blog.user.id,
    });
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'hide' : 'view'}
      </button>
      {expanded && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {user.username === blog.user.username && (
            <button onClick={async () => await handleDelete(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
