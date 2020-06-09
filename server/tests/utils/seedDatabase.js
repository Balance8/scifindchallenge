import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma.js';

const userOne = {
  input: {
    name: 'Amanda',
    email: 'amanda_seed@example.com',
    password: bcrypt.hashSync('Shinji098!@#$'),
  },
  user: undefined,
  jwt: undefined,
};

const userTwo = {
  input: {
    name: 'Michael',
    email: 'michael_seed@example.com',
    password: bcrypt.hashSync('APASSFORMICHAEL'),
  },
  user: undefined,
  jwt: undefined,
};

const postOne = {
  input: {
    title: 'Published Test Post',
    body: 'This post should be published',
    published: true,
  },
  post: undefined,
};

const postTwo = {
  input: {
    title: 'Unpublished Test Post',
    body: 'This post should be unpublished',
    published: false,
  },
  post: undefined,
};

const commentOne = {
  input: {
    text: 'User One comment on Post One',
  },
  comment: undefined,
};

const commentTwo = {
  input: {
    text: 'User Two comment on Post One',
  },
  comment: undefined,
};

const DIRECTORY_DATA = [
  {
    title: 'hats',
    imageUrl: 'https://i.ibb.co/cvpntL1/hats.png',
    id: 1,
    linkUrl: 'shop/hats',
  },
  {
    title: 'jackets',
    imageUrl: 'https://i.ibb.co/px2tCc3/jackets.png',
    id: 2,
    linkUrl: 'shop/jackets',
  },
  {
    title: 'sneakers',
    imageUrl: 'https://i.ibb.co/0jqHpnp/sneakers.png',
    id: 3,
    linkUrl: 'shop/sneakers',
  },
  {
    title: 'womens',
    imageUrl: 'https://i.ibb.co/GCCdy8t/womens.png',
    size: 'large',
    id: 4,
    linkUrl: 'shop/womens',
  },
  {
    title: 'mens',
    imageUrl: 'https://i.ibb.co/R70vBrQ/men.png',
    size: 'large',
    id: 5,
    linkUrl: 'shop/mens',
  },
];

const seedDatabase = async () => {
  // Delete Test Data
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create User One
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  // Create User Two
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

  // Create Post One
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  });

  // Create Post Two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  });

  // Create Comment from User One on Post One
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
    },
  });

  // Create Comment from User Two on Post One
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userTwo.user.id,
        },
      },
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
    },
  });
};

export {
  seedDatabase as default,
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo,
};
