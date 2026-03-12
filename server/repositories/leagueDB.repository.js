import { PrismaClient } from "@prisma/client";

export class LeagueDBRepository {
    constructor(){
        this.prisma = new PrismaClient()
    }

    findAllLeague(){
        return this.prisma.competitions.findMany({
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
                has_jerseys: true,
            },
        });
    }

    findLeague(leagueId){
        return this.prisma.competitions.findUnique({
            where: { id: leagueId},
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
                has_jerseys: true,
            }
        })
    }
}