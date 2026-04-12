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
  id: number,
  name: string,
  emblem: string | null
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
  getFavorite(userId: number): Promise<FavoriteItem[]>;
  addLeagueFavorite(
    userId: number,
    leagueId: number
  ): Promise<ServiceResult<{ message: string }>>
  removeLeagueFavorite(
    userId: number,
    leagueId: number
  ): Promise<ServiceResult<{ message: string }>>
  getLeagueFavorite(
    userId: number,
  ): Promise<LeagueFavoriteItem[]>
}

export class FavoriteService implements IFavoriteService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly teamRepo: ITeamDBRepository,
    private readonly favRepo: IUserFavoritesRepository,
    private readonly leagueRepo: ILeagueDBRepository
  ) {}

  async addFavorite(
    userId: number,
    teamId: number
  ): Promise<ServiceResult<{ message: string }>> {
    const user = await this.userRepo.findById(userId);
    if (!user) return { success: false, message: 'Utilisateur introuvable.' };

    const team = await this.teamRepo.findById(teamId);
    if (!team) return { success: false, message: 'Equipe introuvable.' };

    const existing = await this.favRepo.find(userId, teamId);
    if (existing)
      return { success: true, message: 'Equipe déjà dans les favoris.' };

    await this.favRepo.create(userId, teamId);
    return { success: true, message: 'Favori ajouté.' };
  }

  async removeFavorite(
    userId: number,
    teamId: number
  ): Promise<ServiceResult<{ message: string }>> {
    const existing = await this.favRepo.find(userId, teamId);
    if (!existing)
      return { success: false, message: "Ce favoris n'existe pas." };

    await this.favRepo.delete(userId, teamId);
    return { success: true, message: 'Favoris supprimé.' };
  }

  async getFavorite(userId: number): Promise<FavoriteItem[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) return [];

    const favorites = await this.favRepo.findAllByUser(userId);
    return favorites
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
  }

  async addLeagueFavorite(
    userId: number, 
    leagueId: number
  ): Promise<ServiceResult<{ message: string; }>> {
    const user = await this.userRepo.findById(userId);
    if (!user) return { success: false, message: 'Utilisateur introuvable.' };

    const league = await this.leagueRepo.findLeague(leagueId)
    if (!league) return { success: false, message: 'Compétition introuvable.' };

    const existing = await this.favRepo.findLeague(userId, leagueId)
    if (existing)
      return { success: true, message: 'La compétition est déjà dans les favoris.' };

    await this.favRepo.createLeague(userId, leagueId)
    return { success: true, message: 'La compétition à bien été ajouté.' };
  }

  async removeLeagueFavorite(
    userId: number, 
    leagueId: number
  ): Promise<ServiceResult<{ message: string; }>> {
    const existing = await this.favRepo.find(userId, leagueId);
      if (!existing)
        return { success: false, message: "Cette compétition n'existe pas dans les favoris." };
    
    await this.favRepo.deleteLeague(userId, leagueId)
    return { success: true, message: 'La compétition à bien été supprimé de vos favoris.' };
  }

  async getLeagueFavorite(userId: number): Promise<LeagueFavoriteItem[]> {
    const user = await this.userRepo.findById(userId)
    if (!user) return [];

    const leagueFavorites = await this.favRepo.findAllByUser(userId)
    return leagueFavorites
      .filter((fav) => fav.competition != null)
      .map((fav) => {
        const league = fav.competition!
        return {
          id: league.id,
          name: league.name,
          emblem: league.image_path
        }
      })
  }
}
