import argon2  from 'argon2';
import type { User } from '@prisma/client';
import { IUserRepository } from '../repositories/user.repository';
import type { UserPayload } from '../types/express';
import type { ServiceResult } from '../types/api';

type RegisterSuccess = { user: User };
type UpdateSuccess = { user: User };

export interface IUserService {
  register(
    username: string,
    email: string,
    password: string
  ): Promise<ServiceResult<RegisterSuccess>>;
  login(email: string, password: string): Promise<ServiceResult<UserPayload>>;
  getAllUsers(): Promise<User[]>;
  updateUser(
    id: number,
    data: { username: string; password: string }
  ): Promise<ServiceResult<UpdateSuccess>>;
  deleteUser(id: number): Promise<ServiceResult<{ message: string }>>;
}

export class UserService implements IUserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<ServiceResult<RegisterSuccess>> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) return { success: false, message: 'Email déja utilisé.' };

    const hashedPassword = await argon2.hash(password);
    const user = await this.userRepo.create({
      username,
      email,
      password: hashedPassword,
    });
    return { success: true, user };
  }

  async login(
    email: string,
    password: string
  ): Promise<ServiceResult<UserPayload>> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return { success: false, message: 'Utilisateur introuvable' };

    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword)
      return { success: false, message: 'Mot de passe incorrect.' };

    const createDateAccount = user.createdAt

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: createDateAccount.toLocaleDateString('fr-FR')
    };

    return { success: true, ...payload };
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.findAll();
  }

async updateUser(
  id: number,
  data: { username?: string; password?: string; currentPassword?: string }
): Promise<ServiceResult<UpdateSuccess>> {
  const user = await this.userRepo.findById(id);
  if (!user) return { success: false, message: 'Utilisateur introuvable' };

  const updateData: { username?: string; password?: string } = {};
  if (data.username) updateData.username = data.username;

  if (data.password) {
    if (!data.currentPassword) {
      return { success: false, message: 'Mot de passe actuel requis' };
    }
    const isValid = await argon2.verify(user.password, data.currentPassword);
    if (!isValid) {
      return { success: false, message: 'Mot de passe actuel incorrect' };
    }
    const newPassword = data.password;
    updateData.password = await argon2.hash(newPassword);
  }

  const updated = await this.userRepo.update(id, updateData);
  return { success: true, user: updated };
}

  async deleteUser(id: number): Promise<ServiceResult<{ message: string }>> {
    const user = await this.userRepo.findById(id);
    if (!user) return { success: false, message: 'Utilisateur introuvable' };

    await this.userRepo.delete(id);
    return { success: true, message: 'Votre compte à bien été supprimé' };
  }
}
