import { Prisma, type User } from '@prisma/client';
import prisma from '../lib/prisma';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(
    email: string
  ): Promise<Pick<User, 'id' | 'email' | 'username' | 'password'> | null>;
  findAll(): Promise<User[]>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(id: number, data: Prisma.UserUpdateInput): Promise<User>;
  delete(id: number): Promise<void>;
}

export class UserRepository implements IUserRepository {
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

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
