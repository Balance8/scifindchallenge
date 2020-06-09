import 'cross-fetch/polyfill';
import prisma from '../src/prisma.js';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, getProfile, getUsers, login } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('should create a new user', async () => {
  const variables = {
    data: {
      name: 'Michael',
      email: 'michael@example.com',
      password: 'MyPass123',
    },
  };

  const response = await client.mutate({
    mutation: createUser,
    variables,
  });

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });
  expect(exists).toBe(true);
});

test('should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Amanda');
});

test('should not login with bad credentials', async () => {
  const variables = {
    data: {
      email: 'jeff@example.com',
      password: 'asdasdasdasd',
    },
  };

  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test('should not sign up user with invalid password', async () => {
  const variables = {
    data: {
      name: 'Michael2',
      email: 'michael2@example.com',
      password: 'MyPass',
    },
  };

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

test('should fetch user profile', async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
