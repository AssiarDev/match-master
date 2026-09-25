import { jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import { requireSelf } from '../../middleware/requireSelf';

/** Response stub whose status() and json() can be chained like Express's. */
const makeResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
};

/** Runs the middleware and reports whether it let the request through. */
const run = (req: Partial<Request>) => {
  const res = makeResponse();
  const next = jest.fn() as NextFunction;
  requireSelf('id')(req as Request, res as unknown as Response, next);
  return { res, next };
};

const user = { id: 1, username: 'test', createdAt: '01/01/2024' };

describe('requireSelf', () => {
  it("laisse passer si l'id de la route est celui de l'utilisateur", () => {
    const { res, next } = run({ user, params: { id: '1' } });

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("refuse avec un 403 si l'id de la route est celui d'un autre utilisateur", () => {
    const { res, next } = run({ user, params: { id: '2' } });

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Action non autorisée' });
  });

  it("refuse avec un 403 si aucun utilisateur n'est authentifié", () => {
    const { res, next } = run({ params: { id: '1' } });

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
