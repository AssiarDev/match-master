import { UserRepository } from "../repositories/user.repository";
import { TeamDBRepository } from "../repositories/teamDB.repository";
import { UserFavoritesRepository } from "../repositories/userFavorites.repository";
import type { ServiceResult } from "../types/api";

export interface FavoriteItem {
  id: number;
  name: string;
  emblem: string | null;
  leagueId: number | null;
  leagueName: string;
}

const userRepo = new UserRepository();
const teamRepo = new TeamDBRepository();
const favRepo = new UserFavoritesRepository();

export class FavoriteService {
  async addFavorite(userId: number, teamId: number): Promise<ServiceResult<{ message: string }>> {
    const user = await userRepo.findById(userId);
    if (!user) return { success: false, message: "Utilisateur introuvable." };

    const team = await teamRepo.findById(teamId);
    if (!team) return { success: false, message: "Equipe introuvable." };

    const existing = await favRepo.find(userId, teamId);
    if (existing)
      return { success: true, message: "Equipe déjà dans les favoris." };

    await favRepo.create(userId, teamId);
    return { success: true, message: "Favori ajouté." };
  }

  async removeFavorite(userId: number, teamId: number): Promise<ServiceResult<{ message: string }>> {
    const existing = await favRepo.find(userId, teamId);
    if (!existing)
      return { success: false, message: "Ce favoris n'existe pas." };

    await favRepo.delete(userId, teamId);
    return { success: true, message: "Favoris supprimé." };
  }

  async getFavorite(userId: number): Promise<FavoriteItem[]> {
    const user = await userRepo.findById(userId);
    if (!user) return [];

    const favorites = await favRepo.findAllByUser(userId);
    return favorites.map((fav) => {
      const team = fav.team!;
      return {
        id: team.id,
        name: team.name,
        emblem: team.image_path,
        leagueId: team.competitions?.[0]?.competition?.id || null,
        leagueName:
          team.competitions?.[0]?.competition?.name ||
          "Compétition inconnue",
      };
    });
  }
}
