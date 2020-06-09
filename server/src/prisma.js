import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements,
});

export { prisma as default };

// callbacks, promises, async/await

// prisma.query prisma.mutation prisma prisma.subscription prisma.exists

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({
//     id: authorId,
//   });

//   if (!userExists) {
//     throw new Error('User not found');
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId,
//           },
//         },
//       },
//     },
//     '{ author { id name email posts { id title published } } }'
//   );
//   return post.author;
// };

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({
//     id: postId,
//   });

//   if (!postExists) {
//     throw new Error('Post not found');
//   }

//   const post = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postId,
//       },
//       data: {
//         ...data,
//       },
//     },
//     '{ author { id name email posts { id title body published } } }'
//   );

//   return post.author;
// };

// createPostForUser('ck9nep3yl00tz0821f9u5l96y', {
//   title: 'Function creation',
//   body: 'the war of art',
//   published: true,
// })
//   .then((user) => console.log(JSON.stringify(user, undefined, 2)))
//   .catch((error) => console.log(error));

// updatePostForUser('ck9olp7us04p40821uv9t3tg8', {
//   title: 'Function updated',
//   body: 'the war of fart',
//   published: true,
// })
//   .then((user) => console.log(JSON.stringify(user, undefined, 2)))
//   .catch((error) => console.log(error));

// prisma.query
//   .users(null, '{id name posts { id title } }')
//   .then((data) => console.log(JSON.stringify(data, undefined, 2)));

// prisma.query
//   .comments(null, '{id text author { id name } }')
//   .then((data) => console.log(JSON.stringify(data, undefined, 2)));
