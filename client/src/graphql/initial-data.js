const INITIAL_DATA = {
  isLoggedIn: !!localStorage.getItem('token'),
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  cartHidden: true,
  cartItems: [],
  itemCount: 0,
  cartTotal: 0,
  currentUser: null,
};

export default INITIAL_DATA;
