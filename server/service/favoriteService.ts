import { IUserRepository } from '../repositories/user.repository';
import { ITeamDBRepository } from '../repositories/teamDB.repository';
import {
  IUserFavoritesRepository,
  type FavoriteKind,
} from '../repositories/userFavorites.repository';
import type { ServiceResult } from '../types/api';
import { MESSAGES } from '../constants/messages';
import { ILeagueDBRepository } from '../repositories/leagueDB.repository';

export interface FavoriteItem {
  id: number;
  name: string;
  emblem: string | null;
  leagueId: number | null;
  leagueName: string;
}

export interface LeagueFavoriteItem {
  id: number;
  name: string;
  emblem: string | null;
}

/** The item returned when listing each kind of favorite. */
export type FavoriteItemByKind = {
  team: FavoriteItem;
  competition: LeagueFavoriteItem;
};

/** What differs between the kinds of favorite; everything else is shared. */
type KindConfig<K extends FavoriteKind> = {
  targetExists(targetId: number): Promise<boolean>;
  list(userId: number): Promise<FavoriteItemByKind[K][]>;
  messages: {
    targetNotFound: string;
    alreadyAdded: string;
    added: string;
    notInFavorites: string;
    removed: string;
  };
};

export interface IFavoriteService {
  add(
    userId: number,
    kind: FavoriteKind,
    targetId: number
  ): Promise<ServiceResult<{ created: boolean; message: string }>>;
  remove(
    userId: number,
    kind: FavoriteKind,
    targetId: number
  ): Promise<ServiceResult<{ message: string }>>;
  list<K extends FavoriteKind>(
    userId: number,
    kind: K
  ): Promise<ServiceResult<{ favorites: FavoriteItemByKind[K][] }>>;
}

export class FavoriteService implements IFavoriteService {
  private readonly kinds: { [K in FavoriteKind]: KindConfig<K> };

  constructor(
    private readonly userRepo: IUserRepository,
    private readonly teamRepo: ITeamDBRepository,
    private readonly favRepo: IUserFavoritesRepository,
    private readonly leagueRepo: ILeagueDBRepository
  ) {
    this.kinds = {
      team: {
        targetExists: async (id) => !!(await this.teamRepo.findById(id)),
        list: async (userId) =>
          (await this.favRepo.findTeamsByUser(userId))
            .filter((fav) => fav.team != null)
            .map((fav) => {
              const team = fav.team!;
              return {
                id: team.id,
                name: team.name,
                emblem: team.image_path,
                leagueId: team.competitions?.[0]?.competition?.id || null,
                leagueName:
                  team.competitions?.[0]?.competition?.name ||
                  'Compétition inconnue',
              };
            }),
        messages: {
          targetNotFound: MESSAGES.team.notFound,
          ...MESSAGES.favorites.team,
        },
      },
      competition: {
        targetExists: async (id) => !!(await this.leagueRepo.findLeague(id)),
        list: async (userId) =>
          (await this.favRepo.findCompetitionsByUser(userId))
            .filter((fav) => fav.competition != null)
            .map((fav) => {
              const league = fav.competition!;
              return {
                id: league.id,
                name: league.name,
                emblem: league.image_path,
              };
            }),
        messages: {
          targetNotFound: MESSAGES.league.notFound,
          ...MESSAGES.favorites.competition,
        },
      },
    };
  }

  /**
   * Adds a team or a competition to a user's favorites.
   * Adding a favorite that is already there is not an error: the result says
   * so through `created: false`, so that the caller can tell it apart from a
   * real creation.
   * @param userId - The ID of the user
   * @param kind - The kind of favorite
   * @param targetId - The ID of the team or competition to add
   * @returns A ServiceResult with `created` and a message, or NOT_FOUND (user
   * or target unknown)
   */
  async add(
    userId: number,
    kind: FavoriteKind,
    targetId: number
  ): Promise<ServiceResult<{ created: boolean; message: string }>> {
    const { targetExists, messages } = this.kinds[kind];

    const user = await this.userRepo.findById(userId);
    if (!user)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: MESSAGES.user.notFound,
      };

    if (!(await targetExists(targetId)))
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: messages.targetNotFound,
      };

    const existing = await this.favRepo.find(userId, kind, targetId);
    if (existing)
      return { success: true, created: false, message: messages.alreadyAdded };

    await this.favRepo.create(userId, kind, targetId);
    return { success: true, created: true, message: messages.added };
  }

  /**
   * Removes a team or a competition from a user's favorites.
   * @param userId - The ID of the user
   * @param kind - The kind of favorite
   * @param targetId - The ID of the team or competition to remove
   * @returns A ServiceResult with a message, or NOT_FOUND (not in favorites)
   */
  async remove(
    userId: number,
    kind: FavoriteKind,
    targetId: number
  ): Promise<ServiceResult<{ message: string }>> {
    const { messages } = this.kinds[kind];

    const existing = await this.favRepo.find(userId, kind, targetId);
    if (!existing)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: messages.notInFavorites,
      };

    await this.favRepo.delete(userId, kind, targetId);
    return { success: true, message: messages.removed };
  }

  /**
   * Lists a user's favorites of one kind. Only that kind is loaded.
   * @param userId - The ID of the user
   * @param kind - The kind of favorite
   * @returns A ServiceResult with the favorites (possibly empty), or NOT_FOUND
   * if the user does not exist
   */
  async list<K extends FavoriteKind>(
    userId: number,
    kind: K
  ): Promise<ServiceResult<{ favorites: FavoriteItemByKind[K][] }>> {
    const user = await this.userRepo.findById(userId);
    if (!user)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: MESSAGES.user.notFound,
      };

    const favorites = await this.kinds[kind].list(userId);
    return { success: true, favorites };
  }
}
