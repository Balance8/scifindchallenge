import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import generateRefreshToken from '../utils/generateRefreshToken';
import hashPassword from '../utils/hashPassword';
import { Prisma } from 'prisma-binding';
import { stripe } from '../stripe';

// Take in password -> Validate Password -> Hash password -> Generate auth token
// JSON Web Token (JWT) - iat = intialized at time
// server generates token, client gets the token, client can use token for future requests

// Enum
// 1. A special type that defines a set of constants
// 2. This type can then be used as the type for a field (similar to scalar and custom object types)
// 3. Values for the field must be one of the constants for the type

// UserRole - standard, editor, admin

// type User{
//  role: UserRole!
// }

// laptop.isOn - true - false
// latop.powerStatus - on - off - sleep / enum gives us more then boolean
// if some one tries to save without one of these types it gets rejected

// Password Demo:
// const dummy = async () => {
//   const email = 'test.com';
//   const password = 'asdasdnewpass';

//   const hashedPassword =
//     '$2a$10$yL1QwvygvSRqFsBn3WcA/.xvt.96z/MT1gIYk7ayNtRrwv4C8wY4i';

//   const isMatch = await bcrypt.compare(password, hashedPassword);
//   console.log(isMatch);
// };
// dummy();

const Mutation = {
  async login(parent, args, { prisma, request }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) {
      throw new Error('No User Found');
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    // Login Successful

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    request.response.cookie('jid', refreshToken, { httpOnly: true });

    return {
      user,
      token,
    };
  },
  async logout(parent, args, { prisma, request }, info) {
    request.response.cookie('jid', '', { httpOnly: true });

    return true;
  },
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);

    // password123 -> apppepfasdfpfklqwe123 ONE WAY HASH

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info
    );
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!postExists) {
      throw new Error('Unable to delete post');
    }

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true,
    });

    if (!postExists) {
      throw new Error('Unable to update post');
    }

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id,
          },
        },
      });
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true,
    });

    if (!postExists) {
      throw new Error('Cannot Create Comment');
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    );
  },
  async deleteComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error('Unable to delete comment');
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
  },
  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error('Unable to delete comment');
    }

    return prisma.mutation.updateComment(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
  },
  async createCollection(parent, { id, data }, { prisma, request }, info) {
    return prisma.mutation.createCollection(
      {
        data: {
          title: data.title,
          items: {
            ...data.items,
          },
        },
      },
      info
    );
  },
  async deleteCollection(parent, args, { prisma, request }, info) {
    const collectionExists = await prisma.exists.Collection({
      id: args.id,
    });

    if (!collectionExists) {
      throw new Error('Unable to delete collection');
    }

    return prisma.mutation.deleteCollection(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  async createItem(parent, args, { prisma, request }, info) {
    return prisma.mutation.createItem(
      {
        data: {
          ...args.data,
          collection: {
            connect: {
              id: args.data.collection,
            },
          },
        },
      },
      info
    );
  },
  async createMultipleItems(parent, args, { prisma, request }, info) {
    var items = [];
    let multipleItems = args.data;
    multipleItems.map(
      (item) =>
        (items = items.concat(
          prisma.mutation.createItem({
            data: {
              ...item,
              collection: {
                connect: {
                  title: args.title,
                },
              },
            },
          })
        ))
    );
    return items.count;
  },
  async createPayment(
    parent,
    { source, amount, currency },
    { prisma, request },
    info
  ) {
    return stripe.charges.create({ source, amount, currency });
  },
};

export { Mutation as default };
