import { jest } from '@jest/globals';
import type { IScorersRepository } from '../../repositories/scorers.repository';
import type { ILeagueService } from '../../service/leagueService';
import type { IPlayersRepository } from '../../repositories/players.repository';
import { ScorersService } from '../../service/scorersService';

describe('ScorersService', () => {
  let scorersRepoMock: Partial<jest.Mocked<IScorersRepository>>;
  let leagueServiceMock: Partial<jest.Mocked<ILeagueService>>;
  let playersRepoMock: Partial<jest.Mocked<IPlayersRepository>>;
  let service: ScorersService;

  beforeEach(() => {
    scorersRepoMock = {
      fetchTopScorers: jest.fn(),
    };

    leagueServiceMock = {
      getLeagueCurrentSeason: jest.fn(),
    };

    playersRepoMock = {
      findPlayersByIds: jest.fn(),
    };

    service = new ScorersService(
      scorersRepoMock as jest.Mocked<IScorersRepository>,
      leagueServiceMock as jest.Mocked<ILeagueService>,
      playersRepoMock as jest.Mocked<IPlayersRepository>
    );
  });

  /** Get top scorers */

  describe('getTopScorers', () => {
    it('retourne les buteurs enrichis', async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: true,
        league: 2024,
      });

      scorersRepoMock.fetchTopScorers?.mockResolvedValue({
        data: [
          { player_id: 10, goals: 12, participant_id: 55 },
          { player_id: 20, goals: 8, participant_id: 66 },
        ],
      });

      playersRepoMock.findPlayersByIds?.mockResolvedValue([
        { id: 10, display_name: 'Mbappé', image_path: 'mbappe.png' } as any,
        { id: 20, display_name: 'Messi', image_path: 'messi.png' } as any,
      ]);

      const result = await service.getTopScorers(1);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.scorers).toEqual([
          {
            player_id: 10,
            goals: 12,
            participant_id: 55,
            player_name: 'Mbappé',
            player_image: 'mbappe.png',
            team_id: 55,
          },
          {
            player_id: 20,
            goals: 8,
            participant_id: 66,
            player_name: 'Messi',
            player_image: 'messi.png',
            team_id: 66,
          },
        ]);
      }
    });

    it('retourne une erreur si la saison courante est introuvable', async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: true,
        league: undefined,
      });

      const result = await service.getTopScorers(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain('No current season');
      }
    });

    it('retourne une erreur si getLeagueCurrentSeason échoue', async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: false,
        message: 'Erreur API',
      });

      const result = await service.getTopScorers(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain('Erreur API');
      }
    });

    it('retourne une erreur si fetchTopScorers échoue', async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: true,
        league: 2024,
      });

      scorersRepoMock.fetchTopScorers?.mockRejectedValue(new Error('DB error'));

      const result = await service.getTopScorers(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain('DB error');
      }
    });

    it('retourne une erreur si findPlayersByIds échoue', async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: true,
        league: 2024,
      });

      scorersRepoMock.fetchTopScorers?.mockResolvedValue({
        data: [{ player_id: 10, goals: 12, participant_id: 55 }],
      });

      playersRepoMock.findPlayersByIds?.mockRejectedValue(
        new Error('Players error')
      );

      const result = await service.getTopScorers(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain('Players error');
      }
    });

    it('retourne une liste vide si aucun buteur disponible', async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: true,
        league: 2024,
      });

      scorersRepoMock.fetchTopScorers?.mockResolvedValue({ data: [] });

      playersRepoMock.findPlayersByIds?.mockResolvedValue([]);

      const result = await service.getTopScorers(1);

      expect(result).toEqual({ success: true, scorers: [] });
    });

    it('utilise le nom générique si le joueur est absent du map', async () => {
      leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
        success: true,
        league: 2024,
      });

      scorersRepoMock.fetchTopScorers?.mockResolvedValue({
        data: [{ player_id: 99, goals: 5, participant_id: 55 }],
      });

      playersRepoMock.findPlayersByIds?.mockResolvedValue([]);

      const result = await service.getTopScorers(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.scorers[0].player_name).toBe('Joueur #99');
        expect(result.scorers[0].player_image).toBeNull();
      }
    });
  });
});
