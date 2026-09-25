import argon2 from 'argon2';
import type { User } from '@prisma/client';
import { IUserRepository } from '../repositories/user.repository';
import type { UserPayload } from '../types/express';
import type { SafeUser, ServiceResult } from '../types/api';
import { validatePassword } from '../utils/validatePassword';

type RegisterSuccess = { user: User };
type UpdateSuccess = { user: SafeUser };

export interface IUserService {
  register(
    username: string,
    email: string,
    password: string
  ): Promise<ServiceResult<RegisterSuccess>>;
  login(email: string, password: string): Promise<ServiceResult<UserPayload>>;
  getUserById(id: number): Promise<ServiceResult<{ user: User }>>;
  getAllUsers(): Promise<ServiceResult<{ users: SafeUser[] }>>;
  updateUser(
    id: number,
    data: { username?: string; password?: string; currentPassword?: string }
  ): Promise<ServiceResult<UpdateSuccess>>;
  deleteUser(id: number): Promise<ServiceResult<{ message: string }>>;
}

export class UserService implements IUserService {
  constructor(private readonly userRepo: IUserRepository) {}

  /**
   * Registers a new user after checking the password strength and email
   * availability, then hashing the password.
   * @param username - The desired username
   * @param email - The user's email address
   * @param password - The user's plain text password
   * @returns A ServiceResult containing the created user, or INVALID_INPUT
   * (password too weak), CONFLICT (email taken)
   */
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<ServiceResult<RegisterSuccess>> {
    const passwordError = validatePassword(password);
    if (passwordError)
      return {
        success: false,
        reason: 'INVALID_INPUT',
        message: passwordError,
      };

    const existing = await this.userRepo.findByEmail(email);
    if (existing)
      return {
        success: false,
        reason: 'CONFLICT',
        message: 'Email déja utilisé.',
      };

    const hashedPassword = await argon2.hash(password);
    const user = await this.userRepo.create({
      username,
      email,
      password: hashedPassword,
    });
    return { success: true, user };
  }

  /**
   * Authenticates a user by verifying their email and password.
   * @param email - The user's email address
   * @param password - The user's plain text password
   * An unknown email and a wrong password share the same reason, so that a
   * caller cannot tell which emails have an account.
   * @returns A ServiceResult containing the user payload, or INVALID_CREDENTIALS
   */
  async login(
    email: string,
    password: string
  ): Promise<ServiceResult<UserPayload>> {
    const user = await this.userRepo.findByEmail(email);
    if (!user)
      return {
        success: false,
        reason: 'INVALID_CREDENTIALS',
        message: 'Utilisateur introuvable',
      };

    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword)
      return {
        success: false,
        reason: 'INVALID_CREDENTIALS',
        message: 'Mot de passe incorrect.',
      };

    const createDateAccount = user.createdAt;

    const payload: UserPayload = {
      id: user.id,
      username: user.username,
      createdAt: createDateAccount.toLocaleDateString('fr-FR'),
    };

    return { success: true, ...payload };
  }

  /**
   * Retrieves all users from the database.
   * @returns A ServiceResult containing all users
   */
  async getAllUsers(): Promise<ServiceResult<{ users: SafeUser[] }>> {
    const users = await this.userRepo.findAll();
    return { success: true, users };
  }

  /**
   * Retrieves a user by its ID.
   * @param id - The ID of the user
   * @returns A ServiceResult containing the user, or NOT_FOUND
   */
  async getUserById(id: number): Promise<ServiceResult<{ user: User }>> {
    const user = await this.userRepo.findById(id);
    if (!user)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: 'Utilisateur introuvable',
      };
    return { success: true, user };
  }

  /**
   * Updates a user's username and/or password.
   * Changing the password requires the current password and a new password
   * strong enough.
   * @param id - The ID of the user to update
   * @param data - The fields to update (username, password, currentPassword)
   * @returns A ServiceResult containing the updated user, or NOT_FOUND,
   * INVALID_INPUT (current password missing, new password too weak),
   * INVALID_CREDENTIALS (current password wrong)
   */
  async updateUser(
    id: number,
    data: { username?: string; password?: string; currentPassword?: string }
  ): Promise<ServiceResult<UpdateSuccess>> {
    const user = await this.userRepo.findById(id);
    if (!user)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: 'Utilisateur introuvable',
      };

    const updateData: { username?: string; password?: string } = {};
    if (data.username) updateData.username = data.username;

    if (data.password) {
      if (!data.currentPassword) {
        return {
          success: false,
          reason: 'INVALID_INPUT',
          message: 'Mot de passe actuel requis',
        };
      }
      const passwordError = validatePassword(data.password);
      if (passwordError)
        return {
          success: false,
          reason: 'INVALID_INPUT',
          message: passwordError,
        };
      const isValid = await argon2.verify(user.password, data.currentPassword);
      if (!isValid) {
        return {
          success: false,
          reason: 'INVALID_CREDENTIALS',
          message: 'Mot de passe actuel incorrect',
        };
      }
      const newPassword = data.password;
      updateData.password = await argon2.hash(newPassword);
    }

    const updated = await this.userRepo.update(id, updateData);
    return { success: true, user: updated };
  }

  /**
   * Deletes a user account by its ID.
   * @param id - The ID of the user to delete
   * @returns A ServiceResult with a confirmation message, or NOT_FOUND
   */
  async deleteUser(id: number): Promise<ServiceResult<{ message: string }>> {
    const user = await this.userRepo.findById(id);
    if (!user)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: 'Utilisateur introuvable',
      };

    await this.userRepo.delete(id);
    return { success: true, message: 'Votre compte à bien été supprimé' };
  }
}
