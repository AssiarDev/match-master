import type { Request, Response } from 'express';
import { favoriteService } from '../lib/container';
import type { FavoriteKind } from '../repositories/userFavorites.repository';
import { sendServiceError } from '../utils/sendServiceError';

/**
 * Builds the handler adding a favorite of the given kind.
 * Answers 201 when the favorite is created, 200 when it was already there.
 * @param kind - The kind of favorite
 * @param bodyField - The body field holding the target ID, e.g. 'clubId'
 */
export const addFavorite =
  (kind: FavoriteKind, bodyField: string) =>
  async (req: Request, res: Response): Promise<void> => {
    const result = await favoriteService.add(
      req.user!.id,
      kind,
      req.body[bodyField]
    );
    if (!result.success) return sendServiceError(res, result);
    res.status(result.created ? 201 : 200).json({ message: result.message });
  };

/**
 * Builds the handler removing a favorite of the given kind.
 * @param kind - The kind of favorite
 * @param param - The route param holding the target ID, e.g. 'clubId'
 */
export const removeFavorite =
  (kind: FavoriteKind, param: string) =>
  async (req: Request, res: Response): Promise<void> => {
    const result = await favoriteService.remove(
      req.user!.id,
      kind,
      Number(req.params[param])
    );
    if (!result.success) return sendServiceError(res, result);
    res.status(200).json({ message: result.message });
  };

/**
 * Builds the handler listing the authenticated user's favorites of the given
 * kind. Must run after requireSelf, which guarantees that the userId of the
 * URL is the authenticated user.
 * @param kind - The kind of favorite
 */
export const listFavorites =
  (kind: FavoriteKind) =>
  async (req: Request, res: Response): Promise<void> => {
    const result = await favoriteService.list(req.user!.id, kind);
    if (!result.success) return sendServiceError(res, result);
    res.status(200).json(result.favorites);
  };
