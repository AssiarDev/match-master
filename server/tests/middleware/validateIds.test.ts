import { jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import { validateIdBody, validateIdParams } from '../../middleware/validateIds';

/** Response stub whose status() and json() can be chained like Express's. */
const makeResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
};

/** Runs a middleware and reports whether it let the request through. */
const run = (
  middleware: (req: Request, res: Response, next: NextFunction) => void,
  req: Partial<Request>
) => {
  const res = makeResponse();
  const next = jest.fn();
  middleware(req as Request, res as unknown as Response, next);
  return { res, next };
};

describe('validateIdParams', () => {
  it.each(['1', '42', '2147483647'])('laisse passer %p', (id) => {
    const { res, next } = run(validateIdParams('id'), { params: { id } });

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it.each(['abc', '12abc', '1.5', '-3', '0', ' 7', '', '2147483648'])(
    'refuse %p avec un 400',
    (id) => {
      const { res, next } = run(validateIdParams('id'), { params: { id } });

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Identifiant invalide.' });
    }
  );

  it('vérifie chacun des paramètres donnés', () => {
    const { res, next } = run(validateIdParams('teamId', 'leagueId'), {
      params: { teamId: '10', leagueId: 'abc' },
    });

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('validateIdBody', () => {
  it('laisse passer un nombre entier positif', () => {
    const { res, next } = run(validateIdBody('clubId'), {
      body: { clubId: 10 },
    });

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it.each<[string, unknown]>([
    ['null', { clubId: null }],
    ['une chaîne', { clubId: '10' }],
    ['un champ absent', {}],
    ['un décimal', { clubId: 1.5 }],
    ['zéro', { clubId: 0 }],
    ['un négatif', { clubId: -1 }],
    ['un corps absent', undefined],
  ])('refuse %s avec un 400', (_label, body) => {
    const { res, next } = run(validateIdBody('clubId'), { body });

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Identifiant invalide.' });
  });
});
