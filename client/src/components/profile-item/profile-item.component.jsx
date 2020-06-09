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
} from './profile-item.styles';

const ME = gql`
  {
    me {
      id
      name
      email
    }
  }
`;

const ProfileItem = ({ history, meQueryGQL }) => {
  const { loading, error, data, refetch } = meQueryGQL;

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <SignInContainer>
      <SignInTitle>Profile Page for {data.me.id}</SignInTitle>
      <div> {data.me.name} </div>
      <div> {data.me.email} </div>
    </SignInContainer>
  );
};

export default withRouter(ProfileItem);
