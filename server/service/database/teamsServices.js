import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const getAllTeams = async () => {
    try {
        const teams = await prisma.club.findMany({
            select: { id: true, name: true, emblem: true }
        })

        if(!teams.length){
            throw new Error('No teams found')
        }

        return teams
    } catch (error){
        console.log('Error Prisma in getAllTeams :', error)
        throw error
    }
}

export const getTeamsById = async (teamId) => {
    try {
        const team = await prisma.club.findMany({
            where: { id: teamId},
            select: { id: true, name: true, emblem: true}
        })

        if(!team){
            throw new Error(`No team found for id: ${teamId}`)
        }

        return team
    } catch (error){
        console.error('Error Prisma in getTeamsById :', error)
        throw error
    }
}