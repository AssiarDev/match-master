import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { endSession, startSession, verifyToken } from '../../lib/session';

const payload = { id: 1, username: 'test', createdAt: '01/01/2024' };

/** Response stub recording the cookies set and cleared. */
const makeResponse = () => ({
  cookie: jest.fn(),
  clearCookie: jest.fn(),
});

/** Options every session cookie must carry, when set and when cleared. */
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
};

describe('session', () => {
  it("startSession pose un cookie 'token' valable 1h avec les options de sécurité", () => {
    const res = makeResponse();

    startSession(res as unknown as Response, payload);

    expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), {
      ...cookieOptions,
      maxAge: 3600 * 1000,
    });
  });

  it('startSession signe un jeton de même durée que le cookie', () => {
    const res = makeResponse();

    startSession(res as unknown as Response, payload);

    const token = res.cookie.mock.calls[0][1] as string;
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject(payload);
    expect(decoded.exp! - decoded.iat!).toBe(3600);
  });

  it('endSession efface le cookie avec les mêmes options que startSession', () => {
    const res = makeResponse();

    endSession(res as unknown as Response);

    expect(res.clearCookie).toHaveBeenCalledWith('token', cookieOptions);
  });

  it('verifyToken rejette un jeton signé avec un autre secret', () => {
    const forged = jwt.sign(payload, 'autre-secret');

    expect(() => verifyToken(forged)).toThrow();
  });

  it('verifyToken rejette un jeton expiré', () => {
    const expired = jwt.sign(payload, process.env.SECRET_KEY!, {
      expiresIn: -10,
    });

    expect(() => verifyToken(expired)).toThrow();
  });
});
