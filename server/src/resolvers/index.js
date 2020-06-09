// Resolvers
import { extractFragmentReplacements } from 'prisma-binding';
import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import User from './User';
import Post from './Post';
import Comment from './Comment';
import Collection from './Collection';
import Item from './Item';

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Comment,
  Collection,
  Item,
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };

