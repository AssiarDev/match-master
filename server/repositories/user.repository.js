import  { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class UserRepository {
    findById(id){
        return prisma.user.findUnique({
            where: { id }
        })
    }

    findByEmail(email){
        return prisma.user.findUnique({
            where: { email }, 
            select: { id: true, email: true, username: true, password: true}
        })
    }

    findAll(){
        return prisma.user.findMany()
    }

    create(data){
        return prisma.user.create({ data })
    }

    update(id, data){
        return prisma.user.update({
            where: { id },
            data
        })
    }

    delete(id){
        return prisma.user.delete({
            where: { id }
        })
    }
}