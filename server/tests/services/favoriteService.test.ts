import { jest } from '@jest/globals';
import type { IUserRepository } from '../../repositories/user.repository';
import type { ITeamDBRepository } from '../../repositories/teamDB.repository';
import type { IUserFavoritesRepository } from '../../repositories/userFavorites.repository';
import type { ILeagueDBRepository } from '../../repositories/leagueDB.repository';
import { FavoriteService } from '../../service/favoriteService';

describe('FavoriteService', () => {
  let userRepoMock: jest.Mocked<IUserRepository>;
  let teamRepoMock: jest.Mocked<ITeamDBRepository>;
  let favRepoMock: jest.Mocked<IUserFavoritesRepository>;
  let leagueRepoMock: jest.Mocked<ILeagueDBRepository>;
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
      findTeamsByUser: jest.fn(),
      findCompetitionsByUser: jest.fn(),
    };

    leagueRepoMock = {
      findAllLeague: jest.fn(),
      findLeague: jest.fn(),
    };

    service = new FavoriteService(
      userRepoMock,
      teamRepoMock,
      favRepoMock,
      leagueRepoMock
    );
  });

  describe('add', () => {
    it('returns NOT_FOUND when the user does not exist', async () => {
      userRepoMock.findById.mockResolvedValue(null);

      const result = await service.add(1, 'team', 10);

      expect(result).toEqual({
        success: false,
        reason: 'NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    });

    it('returns NOT_FOUND when the team does not exist', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      teamRepoMock.findById.mockResolvedValue(null);

      const result = await service.add(1, 'team', 10);

      expect(result).toEqual({
        success: false,
        reason: 'NOT_FOUND',
        message: 'Equipe introuvable.',
      });
    });

    it('returns NOT_FOUND when the competition does not exist', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      leagueRepoMock.findLeague.mockResolvedValue(null);

      const result = await service.add(1, 'competition', 10);

      expect(result).toEqual({
        success: false,
        reason: 'NOT_FOUND',
        message: 'Compétition introuvable.',
      });
      expect(teamRepoMock.findById).not.toHaveBeenCalled();
    });

    it('returns created: false without creating when the favorite already exists', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      teamRepoMock.findById.mockResolvedValue({ id: 10 } as any);
      favRepoMock.find.mockResolvedValue({ id: 99 } as any);

      const result = await service.add(1, 'team', 10);

      expect(favRepoMock.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        created: false,
        message: 'Equipe déjà dans les favoris.',
      });
    });

    it('creates a team favorite and returns created: true', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      teamRepoMock.findById.mockResolvedValue({ id: 10 } as any);
      favRepoMock.find.mockResolvedValue(null);

      const result = await service.add(1, 'team', 10);

      expect(favRepoMock.create).toHaveBeenCalledWith(1, 'team', 10);
      expect(result).toEqual({
        success: true,
        created: true,
        message: 'Favori ajouté.',
      });
    });

    it('creates a competition favorite and returns created: true', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      leagueRepoMock.findLeague.mockResolvedValue({ id: 10 } as any);
      favRepoMock.find.mockResolvedValue(null);

      const result = await service.add(1, 'competition', 10);

      expect(favRepoMock.create).toHaveBeenCalledWith(1, 'competition', 10);
      expect(result).toEqual({
        success: true,
        created: true,
        message: 'La compétition à bien été ajouté.',
      });
    });
  });

  describe('remove', () => {
    it('returns NOT_FOUND when the team is not in favorites', async () => {
      favRepoMock.find.mockResolvedValue(null);

      const result = await service.remove(1, 'team', 10);

      expect(favRepoMock.delete).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        reason: 'NOT_FOUND',
        message: "Ce favoris n'existe pas.",
      });
    });

    it('removes an existing team favorite', async () => {
      favRepoMock.find.mockResolvedValue({ id: 99 } as any);

      const result = await service.remove(1, 'team', 10);

      expect(favRepoMock.delete).toHaveBeenCalledWith(1, 'team', 10);
      expect(result).toEqual({ success: true, message: 'Favoris supprimé.' });
    });

    it('removes an existing competition favorite', async () => {
      favRepoMock.find.mockResolvedValue({ id: 99 } as any);

      const result = await service.remove(1, 'competition', 10);

      expect(favRepoMock.delete).toHaveBeenCalledWith(1, 'competition', 10);
      expect(result).toEqual({
        success: true,
        message: 'La compétition à bien été supprimé de vos favoris.',
      });
    });
  });

  describe('list', () => {
    it('returns NOT_FOUND when the user does not exist', async () => {
      userRepoMock.findById.mockResolvedValue(null);

      const result = await service.list(1, 'team');

      expect(result).toEqual({
        success: false,
        reason: 'NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    });

    it('returns an empty list when the user has no favorite', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      favRepoMock.findTeamsByUser.mockResolvedValue([]);

      const result = await service.list(1, 'team');

      expect(result).toEqual({ success: true, favorites: [] });
    });

    it('lists the formatted teams without loading competitions', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      favRepoMock.findTeamsByUser.mockResolvedValue([
        {
          team: {
            id: 44,
            name: 'OM',
            image_path: 'om.png',
            competitions: [{ competition: { id: 301, name: 'Ligue 1' } }],
          },
        },
      ]);

      const result = await service.list(1, 'team');

      expect(favRepoMock.findCompetitionsByUser).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        favorites: [
          {
            id: 44,
            name: 'OM',
            emblem: 'om.png',
            leagueId: 301,
            leagueName: 'Ligue 1',
          },
        ],
      });
    });

    it('lists the formatted competitions without loading teams', async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 } as any);
      favRepoMock.findCompetitionsByUser.mockResolvedValue([
        {
          competition: { id: 301, name: 'Ligue 1', image_path: 'ligue1.png' },
        },
      ]);

      const result = await service.list(1, 'competition');

      expect(favRepoMock.findTeamsByUser).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        favorites: [{ id: 301, name: 'Ligue 1', emblem: 'ligue1.png' }],
      });
    });
  });
});
