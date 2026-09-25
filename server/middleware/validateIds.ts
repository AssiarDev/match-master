import type { NextFunction, Request, Response } from 'express';
import { MESSAGES } from '../constants/messages';

/**
 * Largest value of a PostgreSQL INTEGER column: a bigger id would make the
 * query fail, so it is rejected upfront as invalid input.
 */
const MAX_ID = 2147483647;

/**
 * The single rule for an id: a whole number, strictly positive, that fits an
 * INTEGER column.
 * @param value - The id, already converted to a number
 */
const isValidId = (value: number): boolean =>
  Number.isSafeInteger(value) && value > 0 && value <= MAX_ID;

/**
 * Rejects the request with a 400 if one of the given route params is not a
 * valid id. Only digits are accepted, so '12abc', '1.5', '-3', '0' or ' 7'
 * are refused (parseInt('12abc') would silently give 12).
 * The controller can then convert the param with Number() safely.
 * @param names - The route params to check, e.g. 'id' for '/teams/:id'
 */
export const validateIdParams =
  (...names: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const invalid = names.some((name) => {
      const raw = req.params[name] ?? '';
      return !/^\d+$/.test(raw) || !isValidId(Number(raw));
    });
    if (invalid) {
      res.status(400).json({ error: MESSAGES.common.invalidId });
      return;
    }
    next();
  };

/**
 * Rejects the request with a 400 if one of the given body fields is not a
 * valid id. The field must be a JSON number: null, a string (even '12'), a
 * missing field or a decimal are refused.
 * @param names - The body fields to check, e.g. 'clubId'
 */
export const validateIdBody =
  (...names: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const invalid = names.some((name) => {
      const value: unknown = req.body?.[name];
      return typeof value !== 'number' || !isValidId(value);
    });
    if (invalid) {
      res.status(400).json({ error: MESSAGES.common.invalidId });
      return;
    }
    next();
  };
