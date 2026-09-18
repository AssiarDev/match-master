import type { Response } from 'express';
import type { ServiceError, ServiceErrorReason } from '../types/api';

/**
 * HTTP status of each business failure reason, the single place where this
 * mapping is decided. Typed as a Record over the reason union: adding a reason
 * without its status does not compile.
 */
const STATUS_BY_REASON: Record<ServiceErrorReason, number> = {
  NOT_FOUND: 404,
  CONFLICT: 409,
  INVALID_CREDENTIALS: 401,
  INVALID_INPUT: 400,
};

/**
 * Sends a service's business failure with the status matching its reason,
 * in the common `{ error }` format.
 * @param res - The Express response
 * @param error - The business failure returned by a service
 */
export const sendServiceError = (res: Response, error: ServiceError): void => {
  res.status(STATUS_BY_REASON[error.reason]).json({ error: error.message });
};
