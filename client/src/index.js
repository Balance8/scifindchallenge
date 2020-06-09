import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-boost';

import { store, persistor } from './redux/store';
import * as serviceWorker from './serviceWorker';

import './index.css';
import { default as App } from './App/App';
import { resolvers, typeDefs } from './graphql/resolvers';
import { default as data } from './graphql/initial-data';

import { getAccessToken } from './utils/accessToken';

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_PROD
      : process.env.REACT_APP_DEV,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = getAccessToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  typeDefs,
  resolvers,
});

client.writeData({ data });

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);

serviceWorker.register();
