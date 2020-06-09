import getUserId from '../utils/getUserId';
import { Prisma } from 'prisma-binding';

const Query = {
  users(parent, args, { prisma }, info) {
    // prisma.query.x(null (operation args), x)
    // nothing, string, object are all valid options for the second argument
    // if nothing, primsa will fall back to default which is all scalar fields
    // string: explictly state what you need, but will not work if info is coming from client which is variable
    // object: object that is created for us is the info object. This contains all the information about the original operation

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.users(opArgs, info);
  },
  myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId,
        },
      },
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        published: true,
      },
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    if (args.query) {
      opArgs.where = {
        text_contains: args.query,
      };
    }

    return prisma.query.comments(opArgs, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId,
      },
    });
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true,
            },
            {
              author: {
                id: userId,
              },
            },
          ],
        },
      },
      info
    );

    if (posts.length === 0) {
      throw new Error('Post not found');
    }
    return posts[0];
  },
  collections: (parent, args, { prisma }, info) => {
    return prisma.query.collections({}, info);
  },
  collection: (parent, args, { prisma }, info) => {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    if (args.id) {
      opArgs.where = {
        id: args.id,
      };
    }
    return prisma.query.collection(opArgs, info);
  },
  getCollectionsByTitle: (parent, args, { prisma }, info) => {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    if (args.title) {
      opArgs.where = {
        title: args.title,
      };
    }
    return prisma.query.collection(opArgs, info);
  },
};

export { Query as default };
