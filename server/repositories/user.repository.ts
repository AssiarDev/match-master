import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, password: true },
    });
  }

  findAll() {
    return prisma.user.findMany();
  }

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}
