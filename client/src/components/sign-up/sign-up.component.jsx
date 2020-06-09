import React, { useState } from 'react';

import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { signUpStart } from '../../redux/user/user.actions'; //remove and check how to convert
import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';

import { SignUpContainer, SignUpTitle } from './sign-up.styles';
import { setAccessToken } from '../../utils/accessToken';

const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      user {
        id
        name
        email
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

const SignUp = ({ history }) => {
  const [loginUser] = useMutation(LOGIN);
  const [setCurrentUser] = useMutation(SET_CURRENT_USER);
  const [signupMutation, { loading }] = useMutation(CREATE_USER, {
    update: (cache, { data: { createUser } }) => {
      localStorage.setItem('token', createUser.token);
      localStorage.setItem('user', JSON.stringify(createUser.user));
      cache.writeData({
        data: {
          isLoggedIn: true,
          user: JSON.parse(localStorage.getItem('user')),
        },
      });
      setCurrentUser({
        variables: {
          user: {
            email: createUser.email,
            token: createUser.token,
          },
        },
      });

      setAccessToken(createUser.token);
    },
  });

  const [userCredentials, setUserCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = userCredentials;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("passwords don't match");
      return;
    }
    try {
      const { data } = await signupMutation({
        variables: {
          data: { name, email, password },
        },
      });
      await loginUser({
        variables: {
          data: { email, password },
        },
      });

      history.push('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <SignUpContainer>
      <SignUpTitle>I do not have a account</SignUpTitle>
      <span>Sign up with your email and password</span>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <FormInput
          type='text'
          name='name'
          value={name}
          onChange={handleChange}
          label='Display Name'
          required
        />
        <FormInput
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          label='Email'
          required
        />
        <FormInput
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          label='Password'
          required
        />
        <FormInput
          type='password'
          name='confirmPassword'
          value={confirmPassword}
          onChange={handleChange}
          label='Confirm Password'
          required
        />
        <CustomButton type='submit'>SIGN UP</CustomButton>
      </form>
    </SignUpContainer>
  );
};

export default withRouter(SignUp);
