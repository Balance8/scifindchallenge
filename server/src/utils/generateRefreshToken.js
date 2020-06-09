import jwt from 'jsonwebtoken';

const generateRefreshToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });

  return token;
};

export { generateRefreshToken as default };
