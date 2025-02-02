import './index.css';
import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const fetchBlogs = async () => {
      if (user !== null) {
        blogService.setToken(user.token);
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      }
    };
    fetchBlogs();
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    blogService.setToken(null);
  };

  const addBlog = async blogObject => {
    const createdBlog = await blogService.create({
      ...blogObject,
      user: user.id,
    });
    setBlogs(blogs.concat(createdBlog));
    notify(`a new blog ${createdBlog.title} by ${createdBlog.author} added`);
  };

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleDelete = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id);
      setBlogs(blogs.filter(b => b.id !== blog.id));
    }
  };

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      {user === null ? (
        <div>
          <Notification notification={notification} />
          <h2>Log in to application</h2>
          <LoginForm setUser={setUser} notify={notify} />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification notification={notification} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>{user.name} logged-in</p>
            <button onClick={handleLogout}>logout</button>
          </div>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm addBlog={addBlog} user={user} />
          </Togglable>
          {sortedBlogs.map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              handleDelete={handleDelete}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
