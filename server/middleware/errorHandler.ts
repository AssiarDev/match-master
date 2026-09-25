import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import { MESSAGES } from '../constants/messages';
import { createLogger } from '../lib/logger';

const log = createLogger('HTTP');

/**
 * Answers every request that matched no route, in the same `{ error }` format
 * as the other error responses (instead of Express's default HTML page).
 * Must be registered after all the routes.
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ error: MESSAGES.common.routeNotFound });
};

/**
 * Final error middleware: catches every error not handled by a controller,
 * including the rejections of async handlers (forwarded by Express 5).
 * - A client error already flagged by Express (e.g. malformed JSON body,
 *   status 400) keeps its status, with a generic message.
 * - Any other error becomes a 500. It is logged with its stack trace, but
 *   nothing technical is sent to the client.
 * If the response has already started (e.g. an SSE stream), it is delegated
 * to Express's default handler, which closes the connection.
 * Must be registered last, after notFoundHandler.
 */
export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = err.status ?? err.statusCode;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    res.status(status).json({ error: MESSAGES.common.invalidRequest });
    return;
  }

  log.error(`${req.method} ${req.originalUrl}`, err);
  res.status(500).json({ error: MESSAGES.common.serverError });
};
