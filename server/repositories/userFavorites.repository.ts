import { type UserFavorite } from '@prisma/client';
import prisma from '../lib/prisma';

/** The kinds of entity a user can add to their favorites. */
export type FavoriteKind = 'team' | 'competition';

export type TeamFavoriteRow = {
  team: {
    id: number;
    name: string;
    image_path: string | null;
    competitions: Array<{
      competition: { id: number; name: string };
    }>;
  } | null;
};

export type CompetitionFavoriteRow = {
  competition: {
    id: number;
    name: string;
    image_path: string | null;
  } | null;
};

export interface IUserFavoritesRepository {
  find(
    userId: number,
    kind: FavoriteKind,
    targetId: number
  ): Promise<UserFavorite | null>;
  create(
    userId: number,
    kind: FavoriteKind,
    targetId: number
  ): Promise<UserFavorite>;
  delete(userId: number, kind: FavoriteKind, targetId: number): Promise<void>;
  findTeamsByUser(userId: number): Promise<TeamFavoriteRow[]>;
  findCompetitionsByUser(userId: number): Promise<CompetitionFavoriteRow[]>;
}

/**
 * Maps a favorite kind to the column holding the targeted entity.
 * @param kind - The kind of favorite
 * @param targetId - The ID of the team or competition
 * @returns The where / data fragment identifying the target
 */
const targetOf = (kind: FavoriteKind, targetId: number) =>
  kind === 'team' ? { team_id: targetId } : { competition_id: targetId };

export class UserFavoritesRepository implements IUserFavoritesRepository {
  find(userId: number, kind: FavoriteKind, targetId: number) {
    return prisma.userFavorite.findFirst({
      where: { user_id: userId, ...targetOf(kind, targetId) },
    });
  }

  create(userId: number, kind: FavoriteKind, targetId: number) {
    return prisma.userFavorite.create({
      data: { user_id: userId, ...targetOf(kind, targetId) },
    });
  }

  async delete(
    userId: number,
    kind: FavoriteKind,
    targetId: number
  ): Promise<void> {
    await prisma.userFavorite.deleteMany({
      where: { user_id: userId, ...targetOf(kind, targetId) },
    });
  }

  /**
   * Lists a user's favorite teams, with only the relations needed to display
   * them: competitions are not loaded.
   * @param userId - The ID of the user
   */
  findTeamsByUser(userId: number) {
    return prisma.userFavorite.findMany({
      where: { user_id: userId, team_id: { not: null } },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            image_path: true,
            competitions: {
              select: {
                competition: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Lists a user's favorite competitions, without loading any team.
   * @param userId - The ID of the user
   */
  findCompetitionsByUser(userId: number) {
    return prisma.userFavorite.findMany({
      where: { user_id: userId, competition_id: { not: null } },
      select: {
        competition: { select: { id: true, name: true, image_path: true } },
      },
    });
  }
}
