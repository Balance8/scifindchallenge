import React from 'react';

import { useMutation } from 'react-apollo';
import { auth } from '../../firebase/firebase.utils';
import { default as CartIcon } from '../cart-icon/cart-icon.container';
import { default as CartDropdown } from '../cart-dropdown/cart-dropdown.container';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import { setAccessToken } from '../../utils/accessToken';

import {
  HeaderContainer,
  LogoContainer,
  OptionsContainer,
  OptionLink,
} from './header.styles';
import gql from 'graphql-tag';

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const Header = ({ currentUser, hidden }) => {
  const [logout] = useMutation(LOGOUT);
  return (
    <HeaderContainer>
      <LogoContainer to='/'>
        <Logo className='logo' />
      </LogoContainer>
      <OptionsContainer>
        <OptionLink to='/shop'>EXPLORE</OptionLink>
        <OptionLink to='/shop'>CONTACT</OptionLink>
        <OptionLink to='/users'>USERS</OptionLink>
        {currentUser ? <OptionLink to='/profile'>PROFILE</OptionLink> : null}
        {currentUser ? (
          <OptionLink
            to='/'
            onClick={async () => {
              setAccessToken('');
              localStorage.clear();
              await logout();
              window.location.reload(false);
            }}
          >
            SIGN OUT
          </OptionLink>
        ) : (
          <OptionLink to='/signin'>SIGN IN</OptionLink>
        )}
        <CartIcon />
      </OptionsContainer>
      {hidden ? null : <CartDropdown />}
    </HeaderContainer>
  );
};

export default Header;
