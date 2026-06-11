import { jest } from '@jest/globals';
import type { IUserRepository } from '../../repositories/user.repository';

const mockHash = jest.fn<() => Promise<string>>();
const mockVerify = jest.fn<() => Promise<boolean>>();

jest.unstable_mockModule('argon2', () => ({
  default: { hash: mockHash, verify: mockVerify },
}));

const { UserService } = await import('../../service/userService');

describe('UserService', () => {
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
    process.env.SECRET_KEY = 'secret';

    jest.clearAllMocks();
  });

  // REGISTER
  it("retourne une erreur si l'email est déjà utilisé", async () => {
    userRepoMock.findByEmail.mockResolvedValue({ id: 1 } as any);

    const result = await service.register('John', 'test@mail.com', 'pass');

    expect(result).toEqual({ success: false, message: 'Email déja utilisé.' });
  });

  it('crée un utilisateur si email libre', async () => {
    userRepoMock.findByEmail.mockResolvedValue(null);
    mockHash.mockResolvedValue('hashedPassword');
    userRepoMock.create.mockResolvedValue({
      id: 1,
      username: 'John',
      email: 'test@mail.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await service.register('John', 'test@mail.com', 'pass');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user.username).toBe('John');
      expect(mockHash).toHaveBeenCalled();
    }
  });

  // LOGIN
  it('retourne une erreur si utilisateur introuvable', async () => {
    userRepoMock.findByEmail.mockResolvedValue(null);

    const result = await service.login('test@mail.com', 'pass');

    expect(result).toEqual({
      success: false,
      message: 'Utilisateur introuvable',
    });
  });

  it('retourne une erreur si mot de passe incorrect', async () => {
    userRepoMock.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@mail.com',
      username: 'John',
      password: 'hashedPassword',
    } as any);
    mockVerify.mockResolvedValue(false);

    const result = await service.login('test@mail.com', 'pass');

    expect(result).toEqual({
      success: false,
      message: 'Mot de passe incorrect.',
    });
  });

  it('retourne le payload si login OK', async () => {
    userRepoMock.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@mail.com',
      username: 'John',
      password: 'hashedPassword',
      createdAt: new Date(),
    } as any);
    mockVerify.mockResolvedValue(true);

    const result = await service.login('test@mail.com', 'pass');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.id).toBe(1);
      expect(result.email).toBe('test@mail.com');
      expect(result.username).toBe('John');
      expect(result.createdAt).toBeDefined();
    }
  });

  // GET ALL USERS
  it('retourne tous les utilisateurs', async () => {
    userRepoMock.findAll.mockResolvedValue([{ id: 1 }] as any);

    const result = await service.getAllUsers();

    expect(result).toEqual([{ id: 1 }]);
  });

  // UPDATE USER
  it('retourne une erreur si utilisateur introuvable (update)', async () => {
    userRepoMock.findById.mockResolvedValue(null);

    const result = await service.updateUser(1, {
      username: 'New',
      password: '1234',
    });

    expect(result).toEqual({
      success: false,
      message: 'Utilisateur introuvable',
    });
  });

  it('met à jour un utilisateur', async () => {
    userRepoMock.findById.mockResolvedValue({
      id: 1,
      password: 'oldHashedPassword',
    } as any);
    mockVerify.mockResolvedValue(true);
    mockHash.mockResolvedValue('newHashedPassword');
    userRepoMock.update.mockResolvedValue({
      id: 1,
      username: 'New',
      email: 'new@mail.com',
    } as any);

    const result = await service.updateUser(1, {
      username: 'New',
      password: 'newPass123',
      currentPassword: 'oldPass',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user.username).toBe('New');
      expect(mockVerify).toHaveBeenCalled();
      expect(mockHash).toHaveBeenCalled();
    }
  });

  it('met à jour uniquement le username sans changer le mot de passe', async () => {
    userRepoMock.findById.mockResolvedValue({
      id: 1,
      password: 'oldHashedPassword',
    } as any);
    userRepoMock.update.mockResolvedValue({
      id: 1,
      username: 'NewName',
      email: 'test@mail.com',
    } as any);

    const result = await service.updateUser(1, { username: 'NewName' });

    expect(mockVerify).not.toHaveBeenCalled();
    expect(mockHash).not.toHaveBeenCalled();
    expect(userRepoMock.update).toHaveBeenCalledWith(1, {
      username: 'NewName',
    });
    expect(result.success).toBe(true);
  });

  it('retourne une erreur si nouveau mot de passe fourni sans mot de passe actuel', async () => {
    userRepoMock.findById.mockResolvedValue({
      id: 1,
      password: 'oldHashedPassword',
    } as any);

    const result = await service.updateUser(1, { password: 'newPass123' });

    expect(result).toEqual({
      success: false,
      message: 'Mot de passe actuel requis',
    });
  });

  it('retourne une erreur si le mot de passe actuel est incorrect', async () => {
    userRepoMock.findById.mockResolvedValue({
      id: 1,
      password: 'oldHashedPassword',
    } as any);
    mockVerify.mockResolvedValue(false);

    const result = await service.updateUser(1, {
      password: 'newPass123',
      currentPassword: 'wrongPass',
    });

    expect(result).toEqual({
      success: false,
      message: 'Mot de passe actuel incorrect',
    });
  });

  // DELETE USER
  it('retourne une erreur si utilisateur introuvable (delete)', async () => {
    userRepoMock.findById.mockResolvedValue(null);

    const result = await service.deleteUser(1);

    expect(result).toEqual({
      success: false,
      message: 'Utilisateur introuvable',
    });
  });

  it('supprime un utilisateur', async () => {
    userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
    userRepoMock.delete.mockResolvedValue(undefined);

    const result = await service.deleteUser(1);

    expect(result).toEqual({
      success: true,
      message: 'Votre compte à bien été supprimé',
    });
  });
});
