import { jest } from '@jest/globals';
import type { IStandingRepository } from '../../repositories/standings.repository';
import type { ITeamService } from '../../service/teamService';
import type { ILeagueService } from '../../service/leagueService';
import { StandingService } from '../../service/standingService';

describe('StandingService', () => {
  let standingRepoMock: Partial<jest.Mocked<IStandingRepository>>;
  let teamServiceMock: Partial<jest.Mocked<ITeamService>>;
  let leagueServiceMock: Partial<jest.Mocked<ILeagueService>>;
  let service: StandingService;

  beforeEach(() => {
    standingRepoMock = {
      fetchStandingBySeason: jest.fn(),
    };

    teamServiceMock = {
      teamsByIds: jest.fn(),
    };

    leagueServiceMock = {
      getLeagueCurrentSeason: jest.fn(),
    };

    service = new StandingService(
      standingRepoMock as jest.Mocked<IStandingRepository>,
      teamServiceMock as jest.Mocked<ITeamService>,
      leagueServiceMock as jest.Mocked<ILeagueService>
    );
  });

  it('retourne les standings enrichis', async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: true,
      league: 2024,
    });

    standingRepoMock.fetchStandingBySeason?.mockResolvedValue({
      data: [
        {
          participant_id: 10,
          team_id: 10,
          details: [
            { type: { code: 'overall-goals-for' }, value: 12 },
            { type: { code: 'overall-goals-against' }, value: 5 },
          ],
        } as any,
      ],
    });

    teamServiceMock.teamsByIds?.mockResolvedValue({
      success: true,
      teams: [
        {
          id: 10,
          name: 'PSG',
          image_path: 'psg.png',
        } as any,
      ],
    });

    const result = await service.getStandingFixtures(1);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.standing[0].team_name).toBe('PSG');
      expect(result.standing[0].team_image).toBe('psg.png');
      expect(result.standing[0].team_id).toBe(10);
      expect(result.standing[0].goals_for).toBe(12);
      expect(result.standing[0].goals_against).toBe(5);
      expect(result.standing[0].goal_diff).toBe(7);
    }
  });

  /** no current season */
  it('retourne une erreur si la saison courante est introuvable', async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: true,
      league: undefined,
    });

    const result = await service.getStandingFixtures(1);

    expect(result).toEqual({
      success: false,
      reason: 'NOT_FOUND',
      message: 'Aucune saison en cours pour cette compétition.',
    });
  });

  /** league season business error */
  it("renvoie telle quelle l'erreur métier de getLeagueCurrentSeason", async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: false,
      reason: 'NOT_FOUND',
      message: 'Compétition introuvable.',
    });

    const result = await service.getStandingFixtures(1);

    expect(result).toEqual({
      success: false,
      reason: 'NOT_FOUND',
      message: 'Compétition introuvable.',
    });
  });

  /** standing repo error */
  it("laisse remonter l'erreur si fetchStandingBySeason échoue", async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: true,
      league: 2024,
    });

    standingRepoMock.fetchStandingBySeason?.mockRejectedValue(
      new Error('DB error')
    );

    await expect(service.getStandingFixtures(1)).rejects.toThrow('DB error');
  });

  /** team service business error */
  it("renvoie telle quelle l'erreur métier de teamsByIds", async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: true,
      league: 2024,
    });

    standingRepoMock.fetchStandingBySeason?.mockResolvedValue({
      data: [{ participant_id: 10, team_id: 10, details: [] } as any],
    });

    teamServiceMock.teamsByIds?.mockResolvedValue({
      success: false,
      reason: 'NOT_FOUND',
      message: 'Teams error',
    });

    const result = await service.getStandingFixtures(1);

    expect(result).toEqual({
      success: false,
      reason: 'NOT_FOUND',
      message: 'Teams error',
    });
  });

  it('retourne une liste vide si aucun standing disponible', async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: true,
      league: 2024,
    });

    standingRepoMock.fetchStandingBySeason?.mockResolvedValue({ data: [] });

    teamServiceMock.teamsByIds?.mockResolvedValue({
      success: true,
      teams: [],
    });

    const result = await service.getStandingFixtures(1);

    expect(result).toEqual({ success: true, standing: [] });
  });

  it("utilise le nom générique si l'équipe est absente du map", async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: true,
      league: 2024,
    });

    standingRepoMock.fetchStandingBySeason?.mockResolvedValue({
      data: [{ participant_id: 99, team_id: 99, details: [] } as any],
    });

    teamServiceMock.teamsByIds?.mockResolvedValue({
      success: true,
      teams: [],
    });

    const result = await service.getStandingFixtures(1);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.standing[0].team_name).toBe('Equipe #99');
      expect(result.standing[0].team_image).toBeNull();
    }
  });
});
