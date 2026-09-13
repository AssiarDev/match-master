import { Prisma, type User } from '@prisma/client';
import prisma from '../lib/prisma';
import type { SafeUser } from '../types/api';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(
    email: string
  ): Promise<Pick<
    User,
    'id' | 'email' | 'username' | 'password' | 'createdAt'
  > | null>;
  findAll(): Promise<SafeUser[]>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  update(id: number, data: Prisma.UserUpdateInput): Promise<SafeUser>;
  delete(id: number): Promise<void>;
}

export class UserRepository implements IUserRepository {
  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        createdAt: true,
      },
    });
  }

  findAll() {
    return prisma.user.findMany({ omit: { password: true } });
  }

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      omit: { password: true },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
