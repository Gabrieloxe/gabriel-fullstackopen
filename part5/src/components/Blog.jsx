import React, { useState } from 'react';
import blogService from '../services/blogs';

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
};

const Blog = ({ blog }) => {
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
        </div>
      )}
    </div>
  );
};

export default Blog;
