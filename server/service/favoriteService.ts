import { IUserRepository } from '../repositories/user.repository';
import { ITeamDBRepository } from '../repositories/teamDB.repository';
import { IUserFavoritesRepository } from '../repositories/userFavorites.repository';
import type { ServiceResult } from '../types/api';
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

export interface IFavoriteService {
  addFavorite(
    userId: number,
    teamId: number
  ): Promise<ServiceResult<{ message: string }>>;
  removeFavorite(
    userId: number,
    teamId: number
  ): Promise<ServiceResult<{ message: string }>>;
  getFavorite(
    userId: number
  ): Promise<ServiceResult<{ favorites: FavoriteItem[] }>>;
  addLeagueFavorite(
    userId: number,
    leagueId: number
  ): Promise<ServiceResult<{ message: string }>>;
  removeLeagueFavorite(
    userId: number,
    leagueId: number
  ): Promise<ServiceResult<{ message: string }>>;
  getLeagueFavorite(
    userId: number
  ): Promise<ServiceResult<{ favorites: LeagueFavoriteItem[] }>>;
}

export class FavoriteService implements IFavoriteService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly teamRepo: ITeamDBRepository,
    private readonly favRepo: IUserFavoritesRepository,
    private readonly leagueRepo: ILeagueDBRepository
  ) {}

  /**
   * Adds a team to a user's favorites.
   * @param userId - The ID of the user
   * @param teamId - The ID of the team to add
   * @returns A ServiceResult with a success message or an error message
   */
  async addFavorite(
    userId: number,
    teamId: number
  ): Promise<ServiceResult<{ message: string }>> {
    const user = await this.userRepo.findById(userId);
    if (!user)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: 'Utilisateur introuvable.',
      };

    const team = await this.teamRepo.findById(teamId);
    if (!team)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: 'Equipe introuvable.',
      };

    const existing = await this.favRepo.find(userId, teamId);
    if (existing)
      return { success: true, message: 'Equipe déjà dans les favoris.' };

    await this.favRepo.create(userId, teamId);
    return { success: true, message: 'Favori ajouté.' };
  }

  /**
   * Removes a team from a user's favorites.
   * @param userId - The ID of the user
   * @param teamId - The ID of the team to remove
   * @returns A ServiceResult with a success message or an error message
   */
  async removeFavorite(
    userId: number,
    teamId: number
  ): Promise<ServiceResult<{ message: string }>> {
    const existing = await this.favRepo.find(userId, teamId);
    if (!existing)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: "Ce favoris n'existe pas.",
      };

    await this.favRepo.delete(userId, teamId);
    return { success: true, message: 'Favoris supprimé.' };
  }

  /**
   * Retrieves all favorite teams for a given user.
   * @param userId - The ID of the user
   * @returns A ServiceResult containing the FavoriteItem list, empty if the user does not exist
   */
  async getFavorite(
    userId: number
  ): Promise<ServiceResult<{ favorites: FavoriteItem[] }>> {
    const user = await this.userRepo.findById(userId);
    if (!user) return { success: true, favorites: [] };

    const rows = await this.favRepo.findAllByUser(userId);
    const favorites = rows
      .filter((fav) => fav.team != null)
      .map((fav) => {
        const team = fav.team!;
        return {
          id: team.id,
          name: team.name,
          emblem: team.image_path,
          leagueId: team.competitions?.[0]?.competition?.id || null,
          leagueName:
            team.competitions?.[0]?.competition?.name || 'Compétition inconnue',
        };
      });
    return { success: true, favorites };
  }

  /**
   * Adds a league to a user's favorites.
   * @param userId - The ID of the user
   * @param leagueId - The ID of the league to add
   * @returns A ServiceResult with a success message or an error message
   */
  async addLeagueFavorite(
    userId: number,
    leagueId: number
  ): Promise<ServiceResult<{ message: string }>> {
    const user = await this.userRepo.findById(userId);
    if (!user)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: 'Utilisateur introuvable.',
      };

    const league = await this.leagueRepo.findLeague(leagueId);
    if (!league)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: 'Compétition introuvable.',
      };

    const existing = await this.favRepo.findLeague(userId, leagueId);
    if (existing)
      return {
        success: true,
        message: 'La compétition est déjà dans les favoris.',
      };

    await this.favRepo.createLeague(userId, leagueId);
    return { success: true, message: 'La compétition à bien été ajouté.' };
  }

  /**
   * Removes a league from a user's favorites.
   * @param userId - The ID of the user
   * @param leagueId - The ID of the league to remove
   * @returns A ServiceResult with a success message or an error message
   */
  async removeLeagueFavorite(
    userId: number,
    leagueId: number
  ): Promise<ServiceResult<{ message: string }>> {
    const existing = await this.favRepo.findLeague(userId, leagueId);
    if (!existing)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: "Cette compétition n'existe pas dans les favoris.",
      };

    await this.favRepo.deleteLeague(userId, leagueId);
    return {
      success: true,
      message: 'La compétition à bien été supprimé de vos favoris.',
    };
  }

  /**
   * Retrieves all favorite leagues for a given user.
   * @param userId - The ID of the user
   * @returns A ServiceResult containing the LeagueFavoriteItem list, empty if the user does not exist
   */
  async getLeagueFavorite(
    userId: number
  ): Promise<ServiceResult<{ favorites: LeagueFavoriteItem[] }>> {
    const user = await this.userRepo.findById(userId);
    if (!user) return { success: true, favorites: [] };

    const rows = await this.favRepo.findAllByUser(userId);
    const favorites = rows
      .filter((fav) => fav.competition != null)
      .map((fav) => {
        const league = fav.competition!;
        return {
          id: league.id,
          name: league.name,
          emblem: league.image_path,
        };
      });
    return { success: true, favorites };
  }
}
