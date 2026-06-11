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

    expect(result).toEqual([{ id: 1, name: 'LYON' }]);
  });

  it('retourne une erreur si aucune équipe trouvée', async () => {
    teamDBRepoMock.findAllTeams!.mockResolvedValue(null as any);

    const result = await service.allTeams();

    expect(result).toEqual({
      success: false,
      message: 'Impossible de récupérer toutes les équipes.',
    });
  });

  // teamById
  it('retourne une équipe par id', async () => {
    teamDBRepoMock.findById!.mockResolvedValue({ id: 1, name: 'LYON' } as any);

    const result = await service.teamById(1);

    expect(result).toEqual({ id: 1, name: 'LYON' });
  });

  it('retourne une erreur si équipe introuvable', async () => {
    teamDBRepoMock.findById!.mockResolvedValue(null as any);

    const result = await service.teamById(1);

    expect(result).toEqual({
      success: false,
      message: "Equipe introuvable via l'id.",
    });
  });

  // teamsByIds
  it('retourne plusieurs équipes', async () => {
    teamDBRepoMock.findByIds!.mockResolvedValue([
      { id: 1, name: 'LYON' },
      { id: 2, name: 'PSG' },
    ] as any);

    const result = await service.teamsByIds([1, 2]);

    expect(result).toEqual([
      { id: 1, name: 'LYON' },
      { id: 2, name: 'PSG' },
    ]);
  });

  it('retourne une erreur si aucune équipe trouvée', async () => {
    teamDBRepoMock.findByIds!.mockResolvedValue(null as any);

    const result = await service.teamsByIds([1, 2]);

    expect(result).toEqual({
      success: false,
      message: "Equipes introuvable via l'id.",
    });
  });

  it('retourne un tableau vide si teamsByIds appelé avec array vide', async () => {
    teamDBRepoMock.findByIds!.mockResolvedValue([] as any);

    const result = await service.teamsByIds([]);

    expect(result).toEqual([]);
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

  it('retourne une erreur si aucune équipe trouvée pour la ligue', async () => {
    teamDBRepoMock.findByLeague!.mockResolvedValue(null as any);

    const result = await service.teamByLeague(1);

    expect(result).toEqual({
      success: false,
      message: 'Equipe introuvable via la ligue.',
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

  it('retourne une erreur si aucune saison active', async () => {
    leagueApiRepoMock.fetchLeagueSeasons!.mockResolvedValue({
      data: { seasons: [] } as any,
    });

    const result = await service.teamsForLeague(1);

    expect(result).toEqual({
      success: false,
      message: 'No active season found',
    });
  });

  it('retourne une erreur si le repo plante', async () => {
    leagueApiRepoMock.fetchLeagueSeasons!.mockRejectedValue(
      new Error('API error')
    );

    const result = await service.teamsForLeague(1);

    expect(result).toEqual({
      success: false,
      message:
        'Impossible de récupérer les équipes pour la ligue : Error: API error',
    });
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
