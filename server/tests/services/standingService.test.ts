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

    teamServiceMock.teamsByIds?.mockResolvedValue([
      {
        id: 10,
        name: 'PSG',
        image_path: 'psg.png',
      } as any,
    ]);

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
      message:
        'Impossible de récupérer le classement Error: No current season for this league',
    });
  });

  /** league season error */
  it('retourne une erreur si getLeagueCurrentSeason échoue', async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: false,
      message: 'Erreur API',
    });

    const result = await service.getStandingFixtures(1);

    expect(result).toEqual({
      success: false,
      message: 'Impossible de récupérer le classement Error: Erreur API',
    });
  });

  /** standing repo error */
  it('retourne une erreur si fetchStandingBySeason échoue', async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: true,
      league: 2024,
    });

    standingRepoMock.fetchStandingBySeason?.mockRejectedValue(
      new Error('DB error')
    );

    const result = await service.getStandingFixtures(1);

    expect(result).toEqual({
      success: false,
      message: 'Impossible de récupérer le classement Error: DB error',
    });
  });

  /** team service error */
  it('retourne une erreur si teamsByIds échoue', async () => {
    leagueServiceMock.getLeagueCurrentSeason?.mockResolvedValue({
      success: true,
      league: 2024,
    });

    standingRepoMock.fetchStandingBySeason?.mockResolvedValue({
      data: [{ participant_id: 10, team_id: 10, details: [] } as any],
    });

    teamServiceMock.teamsByIds?.mockResolvedValue({
      success: false,
      message: 'Teams error',
    } as any);

    const result = await service.getStandingFixtures(1);

    expect(result).toEqual({
      success: false,
      message: 'Impossible de récupérer le classement Error: Teams error',
    });
  });
});
