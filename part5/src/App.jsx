import './index.css';
import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Toggable from './components/Toggable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      notify('Wrong username or password', 'error');
      setTimeout(() => {
        notify(null);
      }, 5000);
    }
  };

  const handleLogout = async event => {
    window.localStorage.clear();
    setUser(null);
    blogService.setToken(null);
  };

  const addBlog = async blogObject => {
    const createdBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(createdBlog));
    notify(`a new blog ${createdBlog.title} by ${createdBlog.author} added`);
  };

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <h2>Log in to application</h2>
        <Toggable buttonLabel='login' ref={blogFormRef}>
          <LoginForm
            handlePasswordChange={setPassword}
            handleUsernameChange={setUsername}
            handleSubmit={handleLogin}
            username={username}
            password={password}
          />
        </Toggable>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p>{user.name} logged-in</p>
        <button onClick={handleLogout}>logout</button>
      </div>
      <BlogForm addBlog={addBlog} />
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
