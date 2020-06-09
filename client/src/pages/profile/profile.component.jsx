import React from 'react';

import { ProfileContainer } from './profile.styles';
import ProfileItem from '../../components/profile-item/profile-item.component';
import ProfileForm from '../../components/profile-form/profile-form.component';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { getAccessToken } from '../../utils/accessToken';

const GET_CURRENT_USER = gql`
  {
    currentUser @client
  }
`;

const ME = gql`
  {
    me {
      id
      name
      email
    }
  }
`;

const ProfilePage = () => {
  const meQueryGQL = useQuery(ME);
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  let isMatching = false;

  if (error) {
    return <div>Error</div>;
  }
  if (data && data.currentUser) {
    const token = getAccessToken();
    isMatching = token === data.currentUser.token;
  }
  return (
    <ProfileContainer>
      <ProfileItem meQueryGQL={meQueryGQL} />
      {data && isMatching ? <ProfileForm refetch={meQueryGQL.refetch} /> : null}
    </ProfileContainer>
  );
};

export default ProfilePage;
