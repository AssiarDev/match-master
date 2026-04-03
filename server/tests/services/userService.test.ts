import { jest } from "@jest/globals";
import type { IUserRepository } from "../../repositories/user.repository";

const mockHash = jest.fn<() => Promise<string>>();
const mockVerify = jest.fn<() => Promise<boolean>>();
const mockSign = jest.fn<() => string>();

jest.unstable_mockModule("argon2", () => ({
  default: { hash: mockHash, verify: mockVerify },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { sign: mockSign },
}));

const { UserService } = await import("../../service/userService");

describe("UserService", () => {
  let userRepoMock: jest.Mocked<IUserRepository>;
  let service: InstanceType<typeof UserService>;

  beforeEach(() => {
    userRepoMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new UserService(userRepoMock);
    process.env.SECRET_KEY = "secret";

    jest.clearAllMocks();
  });

  // REGISTER
  it("retourne une erreur si l'email est déjà utilisé", async () => {
    userRepoMock.findByEmail.mockResolvedValue({ id: 1 } as any);

    const result = await service.register("John", "test@mail.com", "pass");

    expect(result).toEqual({ success: false, message: "Email déja utilisé." });
  });

  it("crée un utilisateur si email libre", async () => {
    userRepoMock.findByEmail.mockResolvedValue(null);
    mockHash.mockResolvedValue("hashedPassword");
    userRepoMock.create.mockResolvedValue({
      id: 1,
      username: "John",
      email: "test@mail.com",
      password: "hashedPassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await service.register("John", "test@mail.com", "pass");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user.username).toBe("John");
      expect(mockHash).toHaveBeenCalled();
    }
  });

  // LOGIN
  it("retourne une erreur si utilisateur introuvable", async () => {
    userRepoMock.findByEmail.mockResolvedValue(null);

    const result = await service.login("test@mail.com", "pass");

    expect(result).toEqual({ success: false, message: "Utilisateur introuvable" });
  });

  it("retourne une erreur si mot de passe incorrect", async () => {
    userRepoMock.findByEmail.mockResolvedValue({
      id: 1,
      email: "test@mail.com",
      username: "John",
      password: "hashedPassword",
    } as any);
    mockVerify.mockResolvedValue(false);

    const result = await service.login("test@mail.com", "pass");

    expect(result).toEqual({ success: false, message: "Mot de passe incorrect." });
  });

  it("retourne un token si login OK", async () => {
    userRepoMock.findByEmail.mockResolvedValue({
      id: 1,
      email: "test@mail.com",
      username: "John",
      password: "hashedPassword",
    } as any);
    mockVerify.mockResolvedValue(true);
    mockSign.mockReturnValue("fakeToken");

    const result = await service.login("test@mail.com", "pass");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.token).toBe("fakeToken");
      expect(result.email).toBe("test@mail.com");
    }
  });

  // GET ALL USERS
  it("retourne tous les utilisateurs", async () => {
    userRepoMock.findAll.mockResolvedValue([{ id: 1 }] as any);

    const result = await service.getAllUsers();

    expect(result).toEqual([{ id: 1 }]);
  });

  // UPDATE USER
  it("retourne une erreur si utilisateur introuvable (update)", async () => {
    userRepoMock.findById.mockResolvedValue(null);

    const result = await service.updateUser(1, { username: "New", email: "new@mail.com" });

    expect(result).toEqual({ success: false, message: "Utilisateur introuvable" });
  });

  it("met à jour un utilisateur", async () => {
    userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
    userRepoMock.update.mockResolvedValue({
      id: 1,
      username: "New",
      email: "new@mail.com",
    } as any);

    const result = await service.updateUser(1, { username: "New", email: "new@mail.com" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user.username).toBe("New");
    }
  });

  // DELETE USER
  it("retourne une erreur si utilisateur introuvable (delete)", async () => {
    userRepoMock.findById.mockResolvedValue(null);

    const result = await service.deleteUser(1);

    expect(result).toEqual({ success: false, message: "Utilisateur introuvable" });
  });

  it("supprime un utilisateur", async () => {
    userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
    userRepoMock.delete.mockResolvedValue(undefined);

    const result = await service.deleteUser(1);

    expect(result).toEqual({ success: true, message: "Utilisateur supprimé" });
  });
});