import { UserRepository } from "../repositories/user.repository.js";
import { TeamRepository } from "../repositories/team.repository.js";
import { UserFavoritesRepository } from "../repositories/userFavorites.repository.js";

const userRepo = new UserRepository()
const teamRepo = new TeamRepository()
const favRepo = new UserFavoritesRepository()

export class FavoriteService {
    async addFavorite(userId, teamId){
        const user = await userRepo.findById(userId)
        if (!user) return { success: false, message: 'Utilisateur introuvable.'}

        const team = await teamRepo.getOneTeamById(teamId)
        if(!team) return { success: false, message: 'Equipe introuvable.'}

        const existing = await favRepo.find(userId, teamId)
        if (existing) return { success: true, message: 'Equipe déjà dans les favoris.'}

        await favRepo.create(userId, teamId)
        return { success: true, message: 'Favori ajouté.'}
    }

    async removeFavorite(userId, teamId){
        const existing = await favRepo.find(userId, teamId)
        if(!existing) return { success: false, message: "Ce favoris n'existe pas."}

        await favRepo.delete(userId, teamId)
        return { success: true, message: "Favoris supprimé."}
    }

    async getFavorite(userId){
        const user = await userRepo.findById(userId)
        if (!user) return []

        const favorites = await favRepo.findAllByUser(userId)

        return favorites.map(fav => ({
            id: fav.team.id,
            name: fav.team.name,
            emblem: fav.team.image_path,
            leagueId: fav.team.competitions?.[0]?.competition?.id || null,
            leagueName: fav.team.competitions?.[0]?.competition?.name || 'Compétition inconnue'
        }))
    }
}