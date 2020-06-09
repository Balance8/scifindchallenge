import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Spinner from '../../components/spinner/spinner.component';

const GET_ALL_USERS = gql`
  query {
    users(orderBy: createdAt_DESC) {
      id
      name
      email
      updatedAt
      createdAt
    }
  }
`;

const UsersPage = () => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  if (loading) {
    return <Spinner />;
  }

  if (data && data.users) {
    const body = data.users.map((user) => (
      <span key={user.id}> {user.name}</span>
    ));
  }

  return (
    <div>
      {data &&
        data.users &&
        data.users.map((user) => (
          <div key={user.id}>
            {' '}
            ID: {user.id} NAME: {user.name} EMAIL:{user.email}
          </div>
        ))}
    </div>
  );
};

export default UsersPage;
