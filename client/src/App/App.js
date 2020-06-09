import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../components/spinner/spinner.component';
import ErrorBoundary from '../components/error-boundary/error-boundary.component';

import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import { GlobalStyle } from './global.styles';

import { default as Header } from '../components/header/header.container';
import { default as CheckoutPage } from '../pages/checkout/checkout.container';
import { setAccessToken, getAccessToken } from '../utils/accessToken';

const HomePage = lazy(() => import('../pages/homepage/homepage.component'));
const ShopPage = lazy(() => import('../pages/shop/shop.component'));
const SignInAndSignUpPage = lazy(() =>
  import('../pages/sign-in-and-sign-up/sign-in-and-sign-up.component')
);
const ProfilePage = lazy(() => import('../pages/profile/profile.component'));
const UsersPage = lazy(() => import('../pages/users/users.component'));

const SET_CURRENT_USER = gql`
  mutation SetCurrentUser($user: User!) {
    setCurrentUser(user: $user) @client
  }
`;

const App = ({ currentUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      process.env.NODE_ENV === 'production'
        ? `${process.env.REACT_APP_PROD}refresh_token`
        : `${process.env.REACT_APP_DEV}refresh_token`,
      {
        method: 'POST',
        credentials: 'include',
      }
    ).then(async (x) => {
      const { accessToken } = await x.json();

      setAccessToken(accessToken);

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <GlobalStyle />
      <Header />
      <Switch>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Route exact path='/' component={HomePage} />
            <Route path='/shop' component={ShopPage} />
            <Route exact path='/checkout' component={CheckoutPage} />
            <Route
              exact
              path='/signin'
              render={() =>
                currentUser ? <Redirect to='/' /> : <SignInAndSignUpPage />
              }
            />
            <Route
              exact
              path='/profile'
              render={() =>
                currentUser ? <Redirect to='/' /> : <ProfilePage />
              }
            />
            <Route exact path='/users' render={() => <UsersPage />} />
          </Suspense>
        </ErrorBoundary>
      </Switch>
    </div>
  );
};

export default App;
