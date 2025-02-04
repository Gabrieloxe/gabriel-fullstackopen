import React, { useState } from 'react';
import loginService from '../services/login';
import blogService from '../services/blogs';
import PropTypes from 'prop-types';

const LoginForm = ({ setUser, notify }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handlePasswordChange = ({ target }) => setPassword(target.value);
  const handleUsernameChange = ({ target }) => setUsername(target.value);

  return (
    <form onSubmit={handleLogin} name='LoginToBlogApp'>
      <div>
        username
        <input
          type='text'
          value={username}
          aria-label='username'
          name='Username'
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          aria-label='password'
          name='Password'
          onChange={handlePasswordChange}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  );
};
export default LoginForm;

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};
