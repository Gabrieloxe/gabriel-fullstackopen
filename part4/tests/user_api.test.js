const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const supertest = require('supertest');
const helper = require('./test_helper');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });
});

describe('new user validations', () => {
  test('creation fails with proper statuscode and message if username is too short', async t => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: '1234535325',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(
      result.body.error.includes(
        'username and password must be at least 3 characters long each'
      ),
      true
    );
  });

  test('creation fails with proper statuscode and message if username is too short', async t => {
    const newUser = {
      username: 'absdfdsfsdfsdfsdf',
      name: 'Short password',
      password: '12',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(
      result.body.error.includes(
        'username and password must be at least 3 characters long each'
      ),
      true
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});
