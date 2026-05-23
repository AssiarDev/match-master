import { jest } from '@jest/globals';
import type { ISeasonRepository } from '../../repositories/season.repository';
import { SeasonService } from '../../service/seasonService';

describe('SeasonService', () => {
  let seasonRepoMock: Partial<jest.Mocked<ISeasonRepository>>;
  let service: SeasonService;

  beforeEach(() => {
    seasonRepoMock = {
      fetchSeasonsTeams: jest.fn(),
      fetchSeasonFixtures: jest.fn(),
    };

    service = new SeasonService(
      seasonRepoMock as jest.Mocked<ISeasonRepository>
    );
  });

  /** Get seasons teams */
  describe('getSeasonsTeams', () => {
    it("retourne les équipes d'une saison", async () => {
      seasonRepoMock.fetchSeasonsTeams?.mockResolvedValue({
        data: { id: 2024, teams: [{ id: 1, name: 'PSG' }] } as any,
      });

      const result = await service.getSeasonsTeams(2024);

      expect(result).toEqual({
        success: true,
        seasonsTeams: { id: 2024, teams: [{ id: 1, name: 'PSG' }] },
      });
    });

    it('retourne une erreur si le repo plante', async () => {
      seasonRepoMock.fetchSeasonsTeams?.mockRejectedValue(
        new Error('DB error')
      );

      const result = await service.getSeasonsTeams(2024);

      expect(result).toEqual({
        success: false,
        message:
          "Impossible de récupérer les saisons de l'équipe : Error: DB error",
      });
    });
  });

  /** Get season fixtures */
  describe('getSeasonFixtures', () => {
    it("retourne les fixtures d'une saison", async () => {
      seasonRepoMock.fetchSeasonFixtures?.mockResolvedValue({
        data: [{ id: 1 }, { id: 2 }],
      });

      const result = await service.getSeasonFixtures(2024);

      expect(result).toEqual({
        success: true,
        seasonFixtures: [{ id: 1 }, { id: 2 }],
      });
    });

    it('retourne un tableau vide si data est null', async () => {
      seasonRepoMock.fetchSeasonFixtures?.mockResolvedValue({
        data: null,
      } as any);

      const result = await service.getSeasonFixtures(2024);

      expect(result).toEqual({
        success: true,
        seasonFixtures: [],
      });
    });

    it('retourne une erreur si le repo plante', async () => {
      seasonRepoMock.fetchSeasonFixtures?.mockRejectedValue(
        new Error('API error')
      );

      const result = await service.getSeasonFixtures(2024);

      expect(result).toEqual({
        success: false,
        message:
          'Impossible de récupérer les fixtures de la saison : Error: API error',
      });
    });
  });
});
