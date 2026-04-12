import { type UserFavorite } from '@prisma/client';
import prisma from '../lib/prisma';

export type FavoriteWithRelation = {
  team?: {
    id: number;
    name: string;
    image_path: string | null;
    competitions: Array<{
      competition: { id: number; name: string };
    }>;
  } | null,
  competition?: {
    id: number, 
    country_id: number | null,
    name: string,
    active: boolean,
    short_code: string | null,
    image_path: string | null,
    type: string,
    sub_type: string | null,
    category: number,
    has_jerseys: boolean
  } | null
};

export interface IUserFavoritesRepository {
  find(userId: number, teamId: number): Promise<UserFavorite | null>;
  create(userId: number, teamId: number): Promise<UserFavorite>;
  delete(userId: number, teamId: number): Promise<UserFavorite>;
  findAllByUser(userId: number): Promise<FavoriteWithRelation[]>;
  findLeague(userId: number, leagueId: number): Promise<UserFavorite | null>
  createLeague(userId: number, leagueId: number): Promise<UserFavorite>
  deleteLeague(userId: number, leagueId: number): Promise<UserFavorite>
}

export class UserFavoritesRepository implements IUserFavoritesRepository {
  find(userId: number, teamId: number) {
    return prisma.userFavorite.findFirst({
      where: { user_id: userId, team_id: teamId },
    });
  }

  create(userId: number, teamId: number) {
    return prisma.userFavorite.create({
      data: { user_id: userId, team_id: teamId },
    });
  }

  delete(userId: number, teamId: number) {
    return prisma.userFavorite.delete({
      where: {
        user_id_team_id: { user_id: userId, team_id: teamId },
      },
    });
  }

  findAllByUser(userId: number) {
    return prisma.userFavorite.findMany({
      where: { user_id: userId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            image_path: true,
            competitions: {
              include: {
                competition: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
        competition: {
          select: {
            id: true,
            country_id: true,
            name: true,
            active: true,
            short_code: true,
            image_path: true,
            type: true,
            sub_type: true,
            category: true,
            has_jerseys: true
          }
        }
      },
    });
  }

  findLeague(userId: number, leagueId: number): Promise<UserFavorite | null> {
    return prisma.userFavorite.findFirst({
      where: { user_id: userId, competition_id: leagueId}
    })
  }

  createLeague(userId: number, leagueId: number): Promise<UserFavorite> {
    return prisma.userFavorite.create({
      data: { user_id: userId, competition_id: leagueId}
    })
  }

  deleteLeague(userId: number, leagueId: number): Promise<UserFavorite> {
    return prisma.userFavorite.delete({
      where: {
        user_id_competition_id: {
          user_id: userId, competition_id: leagueId
        }
      }
    })
  }
}
