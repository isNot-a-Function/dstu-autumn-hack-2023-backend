import { sign, verify } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } from '../../config';

export const createToken = (user: User): string => {
  return sign({
    role: user.role,
    userId: user.id,
  }, JWT_ACCESS_SECRET, {
    algorithm: 'HS256',
    expiresIn: '15m',
  });
};

export const verifyAccessToken = (accessToken: string) => {
  try {
    return verify(accessToken, JWT_ACCESS_SECRET);
  } catch (error) {
    return 'Invalid signature';
  }
};

export const createRefreshToken = (user: User): string => {
  return sign({
    userId: user.id,
  }, JWT_REFRESH_SECRET, {
    algorithm: 'HS256',
    expiresIn: '60d',
  });
};

export const verifyRefreshToken = (refreshToken: string) => {
  try {
    return verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (error) {
    return 'Invalid signature';
  }
};
