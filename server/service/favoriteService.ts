import { UserRepository } from "../repositories/user.repository";
import { TeamDBRepository } from "../repositories/teamDB.repository";
import { UserFavoritesRepository } from "../repositories/userFavorites.repository";

export class FavoriteService {
  private userRepo: UserRepository;
  private teamRepo: TeamDBRepository;
  private favRepo: UserFavoritesRepository;

  constructor(userRepo: UserRepository, teamRepo: TeamDBRepository, favRepo: UserFavoritesRepository) {
    this.userRepo = userRepo;
    this.teamRepo = teamRepo;
    this.favRepo = favRepo;
  }

  async addFavorite(userId: number, teamId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) return { success: false, message: "Utilisateur introuvable." };

    const team = await this.teamRepo.getOneTeamById(teamId);
    if (!team) return { success: false, message: "Equipe introuvable." };

    const existing = await this.favRepo.find(userId, teamId);
    if (existing)
      return { success: true, message: "Equipe déjà dans les favoris." };

    await this.favRepo.create(userId, teamId);
    return { success: true, message: "Favori ajouté." };
  }

  async removeFavorite(userId: number, teamId: number) {
    const existing = await this.favRepo.find(userId, teamId);
    if (!existing)
      return { success: false, message: "Ce favoris n'existe pas." };

    await this.favRepo.delete(userId, teamId);
    return { success: true, message: "Favoris supprimé." };
  }

  async getFavorite(userId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) return [];

    const favorites = await this.favRepo.findAllByUser(userId);
    return favorites.map((fav: any) => ({
      id: fav.team.id,
      name: fav.team.name,
      emblem: fav.team.image_path,
      leagueId: fav.team.competitions?.[0]?.competition?.id || null,
      leagueName:
        fav.team.competitions?.[0]?.competition?.name ||
        "Compétition inconnue",
    }));
  }
}
