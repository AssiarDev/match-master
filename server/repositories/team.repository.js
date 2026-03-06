import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export class TeamRepository {
    getAllTeams(){
        return prisma.team.findMany({
            select: {
                id: true,
                name: true,
                image_path: true
            }
        })
    }

    getTeamsById(teamIds){
        return prisma.team.findMany({
            where: {
                id: { in: teamIds }
            }
        })
    }

    getOneTeamById(teamId){
        return prisma.team.findUnique({
            where: { id: teamId }
        })
    }

    getTeamsByLeague(leagueId){
        return prisma.competitions.findUnique({
            where: { id: leagueId },
            include: {
                teams: {
                    team: true
                }
            }
        })
    }
}