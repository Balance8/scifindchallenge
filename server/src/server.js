import { GraphQLServer, PubSub } from 'graphql-yoga';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import generateToken from './utils/generateToken';
import generateRefreshToken from './utils/generateRefreshToken';

//Resolvers
import { resolvers, fragmentReplacements } from './resolvers/index';

import prisma from './prisma';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => ({ pubsub, prisma, request }),
  fragmentReplacements,
});

server.express.use(
  cors({
    credentials: true,
    origin: 'https://slo-event-planner-client.herokuapp.com',
  })
);

server.express.use(cookieParser());

server.express.post('/refresh_token', (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload = null;
  try {
    payload = verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    console.log(error);
    return res.send({ ok: false, accessToken: '' });
  }

  //token is valid and we can send back access token
  const refreshToken = generateRefreshToken(payload.userId);

  res.cookie('jid', refreshToken, { httpOnly: true });

  return res.send({ ok: true, accessToken: generateToken(payload.userId) });
});

export { server as default };
