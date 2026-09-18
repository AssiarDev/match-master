import { jest } from '@jest/globals';
import type { IMatchRepository } from '../../repositories/matches.repository';
import type { ILeagueService } from '../../service/leagueService';
import type { ISeasonService } from '../../service/seasonService';
import { MatchesService } from '../../service/matchesService';

describe('MatchesService', () => {
  let matchesRepoMock: Partial<jest.Mocked<IMatchRepository>>;
  let leagueServiceMock: Partial<jest.Mocked<ILeagueService>>;
  let seasonServiceMock: Partial<jest.Mocked<ISeasonService>>;
  let service: MatchesService;

  beforeEach(() => {
    matchesRepoMock = {
      fetchMatchesByDate: jest.fn(),
      fetchMatchesByTeam: jest.fn(),
      fetchLiveMatches: jest.fn(),
    };

    leagueServiceMock = {
      getLeagueCurrentSeason: jest.fn(),
    };

    seasonServiceMock = {
      getSeasonFixtures: jest.fn(),
    };

    service = new MatchesService(
      matchesRepoMock as jest.Mocked<IMatchRepository>,
      leagueServiceMock as jest.Mocked<ILeagueService>,
      seasonServiceMock as jest.Mocked<ISeasonService>
    );
  });

  /** Get league matches */
  describe('getLeagueMatches', () => {
    it("retourne les matchs d'une ligue", async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: true,
        league: 2024,
      });

      seasonServiceMock.getSeasonFixtures?.mockResolvedValue({
        success: true,
        seasonFixtures: [{ id: 1 }, { id: 2 }],
      });

      const result = await service.getLeagueMatches(1);

      expect(result).toEqual({
        success: true,
        matches: [{ id: 1 }, { id: 2 }],
      });
    });

    it('retourne une erreur si la saison courante est introuvable', async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: true,
        league: undefined,
      });

      const result = await service.getLeagueMatches(1);

      expect(result.success).toBe(true);
      expect(result).toEqual({
        success: true,
        matches: [],
      });
    });

    it("renvoie telle quelle l'erreur métier de getLeagueCurrentSeason", async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: false,
        reason: 'NOT_FOUND',
        message: 'Compétition introuvable.',
      });

      const result = await service.getLeagueMatches(1);

      expect(result).toEqual({
        success: false,
        reason: 'NOT_FOUND',
        message: 'Compétition introuvable.',
      });
    });

    it("laisse remonter l'erreur si getLeagueCurrentSeason plante", async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockRejectedValue(
        new Error('Erreur API')
      );

      await expect(service.getLeagueMatches(1)).rejects.toThrow('Erreur API');
    });

    it("laisse remonter l'erreur si getSeasonFixtures plante", async () => {
      leagueServiceMock.getLeagueCurrentSeason!.mockResolvedValue({
        success: true,
        league: 2024,
      });

      seasonServiceMock.getSeasonFixtures?.mockRejectedValue(
        new Error('Erreur API')
      );

      await expect(service.getLeagueMatches(1)).rejects.toThrow('Erreur API');
    });
  });

  /** Get matches by date */
  describe('getMatchesByDate', () => {
    it('groupe les matchs par ligue', async () => {
      matchesRepoMock.fetchMatchesByDate!.mockResolvedValue({
        data: [
          {
            id: 1,
            league: { name: 'Ligue 1', image_path: 'flag1.png' },
          },
          {
            id: 2,
            league: { name: 'Ligue 1', image_path: 'flag1.png' },
          },
          {
            id: 3,
            league: { name: 'Premier League', image_path: 'flag2.png' },
          },
        ],
      });

      const result = await service.getMatchesByDate('2024-01-01');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.matches['Ligue 1'].matches.length).toBe(2);
        expect(result.matches['Premier League'].matches.length).toBe(1);
      }
    });

    it("laisse remonter l'erreur si le repo plante", async () => {
      matchesRepoMock.fetchMatchesByDate!.mockRejectedValue(
        new Error('DB error')
      );

      await expect(service.getMatchesByDate('2024-01-01')).rejects.toThrow(
        'DB error'
      );
    });

    it('retourne un objet vide si aucun match pour la date', async () => {
      matchesRepoMock.fetchMatchesByDate!.mockResolvedValue({ data: [] });

      const result = await service.getMatchesByDate('2024-01-01');

      expect(result).toEqual({ success: true, matches: {} });
    });

    it("groupe sous 'unknown league' si le match n'a pas d'info de ligue", async () => {
      matchesRepoMock.fetchMatchesByDate!.mockResolvedValue({
        data: [{ id: 1, league: null }] as any,
      });

      const result = await service.getMatchesByDate('2024-01-01');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.matches['unknown league']).toBeDefined();
        expect(result.matches['unknown league'].matches.length).toBe(1);
        expect(result.matches['unknown league'].flag).toBe('');
      }
    });
  });

  /** Get live matches */
  describe('getLiveMatches', () => {
    it('retourne les matchs en direct', async () => {
      matchesRepoMock.fetchLiveMatches!.mockResolvedValue({
        data: [
          { id: 1, name: 'PSG vs Lyon' },
          { id: 2, name: 'OM vs Nice' },
        ] as any,
      });

      const result = await service.getLiveMatches();

      expect(result).toEqual({
        success: true,
        matches: [
          { id: 1, name: 'PSG vs Lyon' },
          { id: 2, name: 'OM vs Nice' },
        ],
      });
    });

    it("retourne un tableau vide quand aucun match n'est en cours", async () => {
      matchesRepoMock.fetchLiveMatches!.mockResolvedValue({
        data: [],
      });

      const result = await service.getLiveMatches();

      expect(result).toEqual({
        success: true,
        matches: [],
      });
    });

    it("laisse remonter l'erreur si le repo plante", async () => {
      matchesRepoMock.fetchLiveMatches!.mockRejectedValue(
        new Error('API error')
      );

      await expect(service.getLiveMatches()).rejects.toThrow('API error');
    });
  });

  /** Get matches by team */
  describe('getMatchesByTeam', () => {
    it("retourne les matchs d'une équipe", async () => {
      matchesRepoMock.fetchMatchesByTeam!.mockResolvedValue({
        data: [{ id: 1 }, { id: 2 }],
      });

      const result = await service.getMatchesByTeam(44);

      expect(result).toEqual({
        success: true,
        matches: [{ id: 1 }, { id: 2 }],
      });
    });

    it("laisse remonter l'erreur si le repo plante", async () => {
      matchesRepoMock.fetchMatchesByTeam!.mockRejectedValue(
        new Error('API error')
      );

      await expect(service.getMatchesByTeam(44)).rejects.toThrow('API error');
    });
  });
});
