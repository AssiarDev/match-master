import { jest } from '@jest/globals';
import type { ITeamDBRepository } from '../../repositories/teamDB.repository';
import type { ILeagueApiRepository } from '../../repositories/leagueApi.repository';
import type { ISeasonRepository } from '../../repositories/season.repository';
import { TeamService } from '../../service/teamService';

describe('TeamService', () => {
  let teamDBRepoMock: Partial<jest.Mocked<ITeamDBRepository>>;
  let leagueApiRepoMock: Partial<jest.Mocked<ILeagueApiRepository>>;
  let seasonRepoMock: Partial<jest.Mocked<ISeasonRepository>>;
  let service: TeamService;

  beforeEach(() => {
    teamDBRepoMock = {
      findAllTeams: jest.fn(),
      findById: jest.fn(),
      findByIds: jest.fn(),
      findByLeague: jest.fn(),
    };

    leagueApiRepoMock = {
      fetchLeagueSeasons: jest.fn(),
    };

    seasonRepoMock = {
      fetchSeasonsTeams: jest.fn(),
    };

    service = new TeamService(
      teamDBRepoMock as jest.Mocked<ITeamDBRepository>,
      leagueApiRepoMock as jest.Mocked<ILeagueApiRepository>,
      seasonRepoMock as jest.Mocked<ISeasonRepository>
    );
  });

  // allTeams
  it('retourne toutes les équipes', async () => {
    teamDBRepoMock.findAllTeams!.mockResolvedValue([
      { id: 1, name: 'LYON' },
    ] as any);

    const result = await service.allTeams();

    expect(result).toEqual({ success: true, teams: [{ id: 1, name: 'LYON' }] });
  });

  it("retourne un tableau vide si aucune équipe n'est en base", async () => {
    teamDBRepoMock.findAllTeams!.mockResolvedValue([]);

    const result = await service.allTeams();

    expect(result).toEqual({ success: true, teams: [] });
  });

  // teamById
  it('retourne une équipe par id', async () => {
    teamDBRepoMock.findById!.mockResolvedValue({ id: 1, name: 'LYON' } as any);

    const result = await service.teamById(1);

    expect(result).toEqual({ success: true, team: { id: 1, name: 'LYON' } });
  });

  it('retourne NOT_FOUND si équipe introuvable', async () => {
    teamDBRepoMock.findById!.mockResolvedValue(null as any);

    const result = await service.teamById(1);

    expect(result).toEqual({
      success: false,
      reason: 'NOT_FOUND',
      message: 'Équipe introuvable.',
    });
  });

  // teamsByIds
  it('retourne plusieurs équipes', async () => {
    teamDBRepoMock.findByIds!.mockResolvedValue([
      { id: 1, name: 'LYON' },
      { id: 2, name: 'PSG' },
    ] as any);

    const result = await service.teamsByIds([1, 2]);

    expect(result).toEqual({
      success: true,
      teams: [
        { id: 1, name: 'LYON' },
        { id: 2, name: 'PSG' },
      ],
    });
  });

  it('retourne un tableau vide si teamsByIds appelé avec array vide', async () => {
    teamDBRepoMock.findByIds!.mockResolvedValue([] as any);

    const result = await service.teamsByIds([]);

    expect(result).toEqual({ success: true, teams: [] });
  });

  // teamByLeague
  it("retourne les équipes d'une ligue", async () => {
    teamDBRepoMock.findByLeague!.mockResolvedValue({
      teams: [{ id: 1, name: 'LYON' }],
    } as any);

    const result = await service.teamByLeague(1);

    expect(result).toEqual({
      success: true,
      teams: [{ id: 1, name: 'LYON' }],
    });
  });

  it('retourne NOT_FOUND si la ligue est introuvable', async () => {
    teamDBRepoMock.findByLeague!.mockResolvedValue(null as any);

    const result = await service.teamByLeague(1);

    expect(result).toEqual({
      success: false,
      reason: 'NOT_FOUND',
      message: 'Compétition introuvable.',
    });
  });

  // teamsForLeague
  it('retourne la saison active et les équipes', async () => {
    leagueApiRepoMock.fetchLeagueSeasons!.mockResolvedValue({
      data: {
        seasons: [
          { id: 2024, is_current: true } as any,
          { id: 2023, is_current: false } as any,
        ],
      } as any,
    });

    seasonRepoMock.fetchSeasonsTeams!.mockResolvedValue({
      data: { teams: [{ id: 1, name: 'LYON' }] },
    } as any);

    const result = await service.teamsForLeague(1);

    expect(result).toEqual({
      success: true,
      result: {
        season: { id: 2024, is_current: true },
        teams: [{ id: 1, name: 'LYON' }],
      },
    });
  });

  it('retourne NOT_FOUND si aucune saison active', async () => {
    leagueApiRepoMock.fetchLeagueSeasons!.mockResolvedValue({
      data: { seasons: [] } as any,
    });

    const result = await service.teamsForLeague(1);

    expect(result).toEqual({
      success: false,
      reason: 'NOT_FOUND',
      message: 'Aucune saison en cours pour cette compétition.',
    });
  });

  it("laisse remonter l'erreur si l'API échoue", async () => {
    leagueApiRepoMock.fetchLeagueSeasons!.mockRejectedValue(
      new Error('API error')
    );

    await expect(service.teamsForLeague(1)).rejects.toThrow('API error');
  });

  it('retourne un tableau vide si teamsData.data est null', async () => {
    leagueApiRepoMock.fetchLeagueSeasons!.mockResolvedValue({
      data: {
        seasons: [{ id: 2024, is_current: true } as any],
      } as any,
    });

    seasonRepoMock.fetchSeasonsTeams!.mockResolvedValue({
      data: null,
    } as any);

    const result = await service.teamsForLeague(1);

    expect(result).toEqual({
      success: true,
      result: {
        season: { id: 2024, is_current: true },
        teams: [],
      },
    });
  });
});
