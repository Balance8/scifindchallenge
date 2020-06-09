import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be 8 characters or longer');
  }

  return bcrypt.hash(password, 10);

  // password123 -> apppepfasdfpfklqwe123 ONE WAY HASH
};

export { hashPassword as default };
