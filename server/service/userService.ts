import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";
import type { UserPayload } from "../types/express";
import type { ServiceResult } from "../types/api";

const userRepo = new UserRepository();

type LoginSuccess = { token: string } & UserPayload;
type RegisterSuccess = { user: User };
type UpdateSuccess = { user: User };

export class UserService {
  async register(username: string, email: string, password: string): Promise<ServiceResult<RegisterSuccess>> {
    const existing = await userRepo.findByEmail(email);
    if (existing) return { success: false, message: "Email déja utilisé." };

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await userRepo.create({
      username,
      email,
      password: hashedPassword,
    });
    return { success: true, user };
  }

  async login(email: string, password: string): Promise<ServiceResult<LoginSuccess>> {
    const user = await userRepo.findByEmail(email);
    if (!user) return { success: false, message: "Utilisateur introuvable" };

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return { success: false, message: "Mot de passe incorrect." };

    const payload: UserPayload = { id: user.id, email: user.email, username: user.username };
    const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "1h" });
    return { success: true, token, ...payload };
  }

  async getAllUsers(): Promise<User[]> {
    return userRepo.findAll();
  }

  async updateUser(id: number, data: { username: string; email: string }): Promise<ServiceResult<UpdateSuccess>> {
    const user = await userRepo.findById(id);
    if (!user) return { success: false, message: "Utilisateur introuvable" };

    const updated = await userRepo.update(id, data);
    return { success: true, user: updated };
  }

  async deleteUser(id: number): Promise<ServiceResult<{ message: string }>> {
    const user = await userRepo.findById(id);
    if (!user) return { success: false, message: "Utilisateur introuvable" };

    await userRepo.delete(id);
    return { success: true, message: "Utilisateur supprimé" };
  }
}
