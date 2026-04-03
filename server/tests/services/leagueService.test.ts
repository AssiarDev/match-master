import { jest } from "@jest/globals";
import type { ILeagueApiRepository } from "../../repositories/leagueApi.repository";
import type { ILeagueDBRepository } from "../../repositories/leagueDB.repository";
import { LeagueService } from "../../service/leagueService";

describe("LeagueService", () => {
  let apiRepoMock: Partial<jest.Mocked<ILeagueApiRepository>>;
  let dbRepoMock: jest.Mocked<ILeagueDBRepository>;
  let service: LeagueService;

  beforeEach(() => {
    apiRepoMock = {
      fetchLeagueSeasons: jest.fn(),
      fetchLeagueCurrentSeason: jest.fn(),
      fetchLeagueWithSeasons: jest.fn(),
    };

    dbRepoMock = {
      findAllLeague: jest.fn(),
      findLeague: jest.fn(),
    };

    service = new LeagueService(
        apiRepoMock as jest.Mocked<ILeagueApiRepository>,
        dbRepoMock as jest.Mocked<ILeagueDBRepository>
    );

  });

  // getAllLeague
  describe("getAllLeague", () => {
    it("retourne la liste des ligues", async () => {
      dbRepoMock.findAllLeague.mockResolvedValue([
        { id: 1, name: "Ligue 1" } as any,
      ]);

      const result = await service.getAllLeague();

      expect(result).toEqual({
        success: true,
        leagues: [{ id: 1, name: "Ligue 1" }],
      });
    });

    it("retourne une erreur si la DB plante", async () => {
      dbRepoMock.findAllLeague.mockRejectedValue(new Error("DB error"));

      const result = await service.getAllLeague();

      expect(result.success).toBe(false);
      expect(result).toEqual({
        success: false,
        message: "Impossible de récupérer les ligues : Error: DB error"
      })
    });
  });

  // ---------------------------
  // getLeagueSeasons
  // ---------------------------
  describe("getLeagueSeasons", () => {
    it("retourne les saisons d'une ligue", async () => {
      apiRepoMock.fetchLeagueSeasons?.mockResolvedValue({
        data: { seasons: [{ id: 2024 }] },
      } as any);

      const result = await service.getLeagueSeasons(1);

      expect(result).toEqual({
        success: true,
        seasons: [{ id: 2024 }],
      });
    });

    it("retourne une erreur si l'API plante", async () => {
      apiRepoMock.fetchLeagueSeasons?.mockRejectedValue(new Error("API error"));

      const result = await service.getLeagueSeasons(1);

      expect(result.success).toBe(false);
      expect(result).toEqual({
        success: false,
        message: "Impossible de récupérer les saisons : Error: API error"
      })
    });
  });

  // getLeague
  describe("getLeague", () => {
    it("retourne une ligue", async () => {
      dbRepoMock.findLeague.mockResolvedValue({ id: 1, name: "Ligue 1" } as any);

      const result = await service.getLeague(1);

      expect(result).toEqual({
        success: true,
        league: { id: 1, name: "Ligue 1" },
      });
    });

    it("retourne une erreur si la DB plante", async () => {
      dbRepoMock.findLeague.mockRejectedValue(new Error("DB error"));

      const result = await service.getLeague(1);

      expect(result.success).toBe(false);
      expect(result).toEqual({
        success: false,
        message: "Erreur lors de la récupération de la ligue : Error: DB error"
      })
    });
  });

  // getLeagueCurrentSeason
  describe("getLeagueCurrentSeason", () => {
    it("retourne la saison courante", async () => {
      apiRepoMock.fetchLeagueCurrentSeason?.mockResolvedValue({
        data: { currentseason: { id: 2024 } },
      } as any);

      const result = await service.getLeagueCurrentSeason(1);

      expect(result).toEqual({
        success: true,
        league: 2024,
      });
    });

    it("retourne une erreur si l'API plante", async () => {
        apiRepoMock.fetchLeagueCurrentSeason?.mockRejectedValue(
            new Error("API error")
        );

        const result = await service.getLeagueCurrentSeason(1);

        expect(result.success).toBe(false);
        expect(result).toEqual({
            success: false,
            message: "Erreur lors de la récupération de la saison courrante de la ligue : Error: API error"
        })
    });
  });

  // getLeagueWithSeasons
  describe("getLeagueWithSeasons", () => {
    it("retourne la ligue avec ses saisons", async () => {
      apiRepoMock.fetchLeagueWithSeasons?.mockResolvedValue({
        data: { id: 1, name: "Ligue 1", seasons: [] },
      } as any);

      const result = await service.getLeagueWithSeasons(1);

      expect(result).toEqual({
        success: true,
        league: { id: 1, name: "Ligue 1", seasons: [] },
      });
    });

    it("retourne une erreur si l'API plante", async () => {
        apiRepoMock.fetchLeagueWithSeasons?.mockRejectedValue(
            new Error("API error")
        );

        const result = await service.getLeagueWithSeasons(1);

        expect(result.success).toBe(false);
        expect(result).toEqual({
            success: false,
            message: "Erreur lors de la récupération de la ligue avec ses saisons : Error: API error"
        })
    });
  });
});