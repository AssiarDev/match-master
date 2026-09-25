import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { CookieOptions, Response } from 'express';
import type { UserPayload } from '../types/express';
import { env } from '../config';

/**
 * Lifetime of a session, in seconds. The single source for both the token's
 * expiry (jsonwebtoken expects seconds) and the cookie's maxAge (Express
 * expects milliseconds), so that they cannot drift apart.
 */
const SESSION_DURATION_SECONDS = 60 * 60;

/**
 * Options shared by setting and clearing the cookie: a browser only removes
 * a cookie when clearCookie is given the same attributes it was set with.
 */
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
};

/**
 * Opens a session: signs a token for the user and stores it in the cookie.
 * @param res - The Express response the cookie is set on
 * @param payload - The user data carried by the token
 */
export const startSession = (res: Response, payload: UserPayload): void => {
  const token = jwt.sign(payload, env.secretKey, {
    expiresIn: SESSION_DURATION_SECONDS,
  });
  res.cookie('token', token, {
    ...cookieOptions,
    maxAge: SESSION_DURATION_SECONDS * 1000,
  });
};

/**
 * Closes a session on the client side by clearing the cookie.
 * Revoking the token itself is the caller's job (see tokenBlacklist).
 * @param res - The Express response the cookie is cleared on
 */
export const endSession = (res: Response): void => {
  res.clearCookie('token', cookieOptions);
};

/**
 * Checks a token's signature and expiry.
 * @param token - The JWT read from the cookie
 * @returns The decoded payload, with the standard claims (exp, iat)
 * @throws If the token is malformed, badly signed or expired
 */
export const verifyToken = (token: string): UserPayload & JwtPayload =>
  jwt.verify(token, env.secretKey) as UserPayload & JwtPayload;
