import { jest } from '@jest/globals';
import type { IUserRepository } from '../../repositories/user.repository';
import type { ITeamDBRepository } from '../../repositories/teamDB.repository';
import type { IUserFavoritesRepository } from '../../repositories/userFavorites.repository';
import { FavoriteService } from '../../service/favoriteService';

describe('FavoriteService', () => {
  let userRepoMock: jest.Mocked<IUserRepository>;
  let teamRepoMock: jest.Mocked<ITeamDBRepository>;
  let favRepoMock: jest.Mocked<IUserFavoritesRepository>;
  let service: FavoriteService;

  beforeEach(() => {
    userRepoMock = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    teamRepoMock = {
      findById: jest.fn(),
      findByIds: jest.fn(),
      findAllTeams: jest.fn(),
      findByLeague: jest.fn(),
    };

    favRepoMock = {
      find: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findAllByUser: jest.fn(),
    };

    service = new FavoriteService(userRepoMock, teamRepoMock, favRepoMock);
  });

  /**Add Favorite */
  describe('addFavorite', () => {
    it("retourne une erreur si l'utilisateur n'existe pas", async () => {
      userRepoMock.findById.mockResolvedValue(null);

      const result = await service.addFavorite(1, 10);

      expect(result).toEqual({
        success: false,
        message: 'Utilisateur introuvable.',
      });
    });

    it("retourne une erreur si l'équipe n'existe pas", async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      teamRepoMock.findById.mockResolvedValue(null);

      const result = await service.addFavorite(1, 10);

      expect(result).toEqual({
        success: false,
        message: 'Equipe introuvable.',
      });
    });

    it('retourne un message si le favori existe déjà', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      teamRepoMock.findById.mockResolvedValue({ id: 10 } as any);
      favRepoMock.find.mockResolvedValue({ id: 99 } as any);

      const result = await service.addFavorite(1, 10);

      expect(result).toEqual({
        success: true,
        message: 'Equipe déjà dans les favoris.',
      });
    });

    it('ajoute un favori si tout est valide', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      teamRepoMock.findById.mockResolvedValue({ id: 10 } as any);
      favRepoMock.find.mockResolvedValue(null);

      const result = await service.addFavorite(1, 10);

      expect(favRepoMock.create).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        success: true,
        message: 'Favori ajouté.',
      });
    });
  });

  /** Remove favorite */
  describe('removeFavorite', () => {
    it("retourne une erreur si le favori n'existe pas", async () => {
      favRepoMock.find.mockResolvedValue(null);

      const result = await service.removeFavorite(1, 10);

      expect(result).toEqual({
        success: false,
        message: "Ce favoris n'existe pas.",
      });
    });

    it('supprime un favori existant', async () => {
      favRepoMock.find.mockResolvedValue({ id: 99 } as any);

      const result = await service.removeFavorite(1, 10);

      expect(favRepoMock.delete).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        success: true,
        message: 'Favoris supprimé.',
      });
    });
  });

  /**Get favorite */
  describe('getFavorite', () => {
    it("retourne un tableau vide si l'utilisateur n'existe pas", async () => {
      userRepoMock.findById.mockResolvedValue(null);

      const result = await service.getFavorite(1);

      expect(result).toEqual([]);
    });

    it('retourne la liste des favoris formatée', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);

      favRepoMock.findAllByUser.mockResolvedValue([
        {
          team: {
            id: 44,
            name: 'OM',
            image_path: 'om.png',
            competitions: [
              {
                competition: { id: 301, name: 'Ligue 1' },
              },
            ],
          },
        },
      ] as any);

      const result = await service.getFavorite(1);

      expect(result).toEqual([
        {
          id: 44,
          name: 'OM',
          emblem: 'om.png',
          leagueId: 301,
          leagueName: 'Ligue 1',
        },
      ]);
    });
  });
});
