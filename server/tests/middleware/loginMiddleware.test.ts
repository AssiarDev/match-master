import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';

jest.unstable_mockModule('../../lib/tokenBlacklist', () => ({
  isBlacklisted: jest.fn(),
  addToBlacklist: jest.fn(),
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { verify: jest.fn() },
}));

const { loginCheck } = await import('../../middleware/loginMiddleware');
const { isBlacklisted } = await import('../../lib/tokenBlacklist');
const { default: jwt } = await import('jsonwebtoken');

const isBlacklistedMock = isBlacklisted as jest.MockedFunction<
  typeof isBlacklisted
>;
const jwtVerifyMock = jwt.verify as jest.MockedFunction<typeof jwt.verify>;

describe('loginCheck', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { cookies: {} };
    mockRes = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('retourne 401 si le token est absent', () => {
    loginCheck(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      redirect: '/login',
      message: 'Accès refusé. Token absent.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('retourne 401 si le token est blacklisté', () => {
    mockReq.cookies = { token: 'token-blackliste' };
    isBlacklistedMock.mockReturnValue(true);

    loginCheck(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token invalide' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('retourne 403 si le token JWT est invalide ou expiré', () => {
    mockReq.cookies = { token: 'token-invalide' };
    isBlacklistedMock.mockReturnValue(false);
    jwtVerifyMock.mockImplementation(() => {
      throw new Error('invalid token');
    });

    loginCheck(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Token invalide ou expiré.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('appelle next() et remplie req.user si le token est valide', () => {
    const payload = {
      id: 1,
      email: 'test@test.com',
      username: 'test',
      createdAt: '2024-01-01',
    };
    mockReq.cookies = { token: 'token-valide' };
    isBlacklistedMock.mockReturnValue(false);
    jwtVerifyMock.mockReturnValue(payload as any);

    loginCheck(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual(payload);
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
