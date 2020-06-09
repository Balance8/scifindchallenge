import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { auth, signInWithGoogle } from '../../firebase/firebase.utils';
import { setAccessToken } from '../../utils/accessToken';

import {
  SignInContainer,
  SignInTitle,
  ButtonsBarContainer,
} from './sign-in.styles';

const LOGIN = gql`
  mutation Login($data: LoginUserInput!) {
    login(data: $data) {
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
      token
    }
  }
`;

const SET_CURRENT_USER = gql`
  mutation SetCurrentUser($user: User!) {
    setCurrentUser(user: $user) @client
  }
`;

const SignIn = ({ googleSignInStart, history }) => {
  const [loginUser] = useMutation(LOGIN);

  const [loginMutation, { loading }] = useMutation(LOGIN, {
    update: (cache, { data: { login } }) => {
      localStorage.setItem('token', login.token);
      localStorage.setItem('user', JSON.stringify(login.user));

      cache.writeData({
        data: {
          isLoggedIn: true,
          user: JSON.parse(localStorage.getItem('user')),
        },
      });
      setCurrentUser({
        variables: {
          user: {
            email: login.email,
            token: login.token,
          },
        },
      });

      setAccessToken(login.token);
    },
  });
  const [setCurrentUser] = useMutation(SET_CURRENT_USER);
  const [userCredentials, setCredentials] = useState({
    email: '',
    password: '',
    token: '',
  });

  const { email, password } = userCredentials;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await loginMutation({
        variables: {
          data: {
            email,
            password,
          },
        },
      });

      history.push('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (userCredentials.token) {
  //     const user = async () => {
  //       await setCurrentUser({
  //         variables: {
  //           displayName: userCredentials.name,
  //           token: userCredentials.token,
  //         },
  //       });
  //     };
  //     console.log(user);
  //   }
  // }, [setCurrentUser, userCredentials]);

  const handleChange = (event) => {
    const { value, name } = event.target;

    setCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <SignInContainer>
      <SignInTitle>I already have an account</SignInTitle>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          name='email'
          // type='email'
          handleChange={handleChange}
          value={email}
          label='email'
          required
        />
        <FormInput
          name='password'
          type='password'
          value={password}
          handleChange={handleChange}
          label='password'
          required
        />
        <ButtonsBarContainer>
          <CustomButton type='submit'> Sign in </CustomButton>
          <CustomButton
            type='button'
            onClick={googleSignInStart}
            isGoogleSignIn
          >
            Sign in with Google
          </CustomButton>
        </ButtonsBarContainer>
      </form>
    </SignInContainer>
  );
};

export default withRouter(SignIn);
