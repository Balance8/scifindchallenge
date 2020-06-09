import 'cross-fetch/polyfill';
import prisma from '../src/prisma.js';
import seedDatabase, {
  userOne,
  userTwo,
  commentOne,
  commentTwo,
  postOne,
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
  deleteComment,
  subscribeToComments,
  subscribeToPosts,
} from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('Should delete own comment', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentOne.comment.id,
  };
  await client.mutate({ mutation: deleteComment, variables });
  const exists = await prisma.exists.Comment({ id: commentOne.comment.id });

  expect(exists).toBe(false);
});

test('Should not delete other users comment', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentTwo.comment.id,
  };
  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow();
});

test('should subscribe to comments for a post', async (done) => {
  const variables = {
    postId: postOne.post.id,
  };

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      // Assertions
      expect(response.data.comment.mutation).toBe('DELETED');
      done();
    },
  });

  // Change a comment to fire off a subscription
  await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } });
});

test('should subscribe to changes for published posts', async (done) => {
  client.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      // Assertions
      expect(response.data.post.mutation).toBe('DELETED');
      done();
    },
  });

  // Change a comment to fire off a subscription
  await prisma.mutation.deletePost({ where: { id: postOne.post.id } });
});


// Create a comment