import { jest } from '@jest/globals';
import type { Response } from 'express';
import { sendServiceError } from '../../utils/sendServiceError';
import type { ServiceErrorReason } from '../../types/api';

/** Response stub whose status() and json() can be chained like Express's. */
const makeResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
};

describe('sendServiceError', () => {
  it.each<[ServiceErrorReason, number]>([
    ['NOT_FOUND', 404],
    ['CONFLICT', 409],
    ['INVALID_CREDENTIALS', 401],
    ['INVALID_INPUT', 400],
  ])('répond %s avec le code %i', (reason, status) => {
    const res = makeResponse();

    sendServiceError(res as unknown as Response, {
      success: false,
      reason,
      message: 'Message métier',
    });

    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({ error: 'Message métier' });
  });
});
