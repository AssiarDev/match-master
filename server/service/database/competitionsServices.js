import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompetitionsIds = async () => {
    try {
        const competitions = await prisma.competition.findMany({
            select: { id: true }
        });
        return competitions.map(c => c.id);
    } catch (error) {
        console.error("Erreur Prisma dans getCompetitionById :", error);
        throw error
    }
};

export const getAllCompetitions = async () => {
    try {
        const competitions = await prisma.competition.findMany({
            where: { type: 'LEAGUE' },
            select: { id: true, name: true, emblem: true, nbSeasons: true },
            orderBy: {
                nbSeasons: 'desc'
            }
        })

        return competitions
    } catch (error){
        console.error('Error Prisma in getAllCompetitions :', error)
        throw error
    }
}

export const getTeamsByCompetitions = async (id) => {
    try {
        const teams = await prisma.club.findMany({
            where: { id_competition: id},
            select: { id: true, name: true, emblem: true, id_competition: true }
        })

        if(!teams.length){
            throw new Error(`No team found for the competitions ${id}`)
        }

        return teams
    } catch (error){
        console.error('Error Prisma in getTeamsByCompetitions :', error)
        throw error
    }
}