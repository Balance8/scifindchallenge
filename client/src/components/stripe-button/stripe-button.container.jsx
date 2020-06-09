import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import StripeButton from './stripe-button.component';
import Spinner from '../spinner/spinner.component';

const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePaymentMutation($source: String!, $amount: Int!) {
    createPayment(source: $source, amount: $amount, currency: "usd") {
      id
    }
  }
`;

const StripeButtonContainer = ({ ...otherProps }) => (
  <Mutation mutation={CREATE_PAYMENT_MUTATION}>
    {(mutate) => (
      <StripeButton
        {...otherProps}
        createPayment={(token, amount) => {
          console.log('test:', amount);
          mutate({ variables: { source: token.id, amount } });
        }}
      />
    )}
  </Mutation>
);

export default StripeButtonContainer;
