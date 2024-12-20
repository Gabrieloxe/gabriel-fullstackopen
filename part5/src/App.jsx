import './index.css';
import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const defaultBlog = {
    title: '',
    author: '',
    url: '',
  };

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState(defaultBlog);
  const [notification, setNotification] = useState(null);

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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  );

  const handleNewBlogChange = ({ target }) => {
    setNewBlog({ ...newBlog, [target.name]: target.value });
  };

  const newBlogForm = () => (
    <form onSubmit={addBlog}>
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

  const addBlog = async event => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title,
      url: newBlog.url,
      author: newBlog.author,
    };

    const createdBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(createdBlog));
    setNewBlog(defaultBlog);
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
        {loginForm()}
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

      {newBlogForm()}
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
