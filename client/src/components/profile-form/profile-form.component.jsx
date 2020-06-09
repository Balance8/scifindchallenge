import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router-dom';
import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import Spinner from '../spinner/spinner.component';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { setAccessToken } from '../../utils/accessToken';

import {
  SignInContainer,
  SignInTitle,
  ButtonsBarContainer,
} from './profile-form.styles';

const GET_CURRENT_USER = gql`
  query user {
    user {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_USER = gql`
  mutation($data: UpdateUserInput!) {
    updateUser(data: $data) {
      name
      email
    }
  }
`;

const ProfileForm = ({ googleSignInStart, history, refetch }) => {
  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const { name, email } = formData;

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateUser({
      variables: {
        data: {
          name,
          email,
        },
      },
    });
    refetch();
  };

  const handleChange = (event) => {
    const { value, name } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  if (updateLoading) {
    return <Spinner />;
  }

  return (
    <SignInContainer>
      <SignInTitle>Update Your Information</SignInTitle>

      <form onSubmit={handleSubmit}>
        <FormInput
          name='name'
          type='name'
          value={name}
          handleChange={handleChange}
          label='name'
        />
        <FormInput
          name='email'
          // type='email'
          handleChange={handleChange}
          value={email}
          label='email'
        />
        <ButtonsBarContainer>
          <CustomButton type='submit'> Update Information </CustomButton>
        </ButtonsBarContainer>
      </form>
    </SignInContainer>
  );
};

export default withRouter(ProfileForm);
