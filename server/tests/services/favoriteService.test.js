import { jest } from '@jest/globals'
import { FavoriteService } from "../../service/favoriteService.js";

describe("FavoriteService", () => {
    let userRepoMock
    let teamRepoMock
    let favRepoMock
    let service

    beforeEach(() => {
        userRepoMock = { findById: jest.fn() }
        teamRepoMock = { getOneTeamById: jest.fn() }
        favRepoMock = {
            find: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            findAllByUser: jest.fn()
        }

        service = new FavoriteService(userRepoMock, teamRepoMock, favRepoMock)
    })

    describe('addFavorite', () => {
        it("retourne une erreur si l'utilisateur n'existe pas", async () => {
            userRepoMock.findById.mockResolvedValue(null)

            const result = await service.addFavorite(1, 10)

            expect(result).toEqual({
                success: false,
                message: "Utilisateur introuvable."
            })
        })

        it("retourne une erreur si l'équipe n'existe pas", async () => {
            userRepoMock.findById.mockResolvedValue({ id: 1 });
            teamRepoMock.getOneTeamById.mockResolvedValue(null);

            const result = await service.addFavorite(1, 10);

            expect(result).toEqual({
                success: false,
                message: "Equipe introuvable.",
            });
        });

        it("retourne un message si le favori existe déjà", async () => {
            userRepoMock.findById.mockResolvedValue({ id: 1 });
            teamRepoMock.getOneTeamById.mockResolvedValue({ id: 10 });
            favRepoMock.find.mockResolvedValue({ id: 99 });

            const result = await service.addFavorite(1, 10);

            expect(result).toEqual({
                success: true,
                message: "Equipe déjà dans les favoris.",
            });
        });

        it("ajoute un favori si tout est valide", async () => {
            userRepoMock.findById.mockResolvedValue({ id: 1 });
            teamRepoMock.getOneTeamById.mockResolvedValue({ id: 10 });
            favRepoMock.find.mockResolvedValue(null);

            const result = await service.addFavorite(1, 10);

            expect(favRepoMock.create).toHaveBeenCalledWith(1, 10);
            expect(result).toEqual({
                success: true,
                message: "Favori ajouté.",
            });
        });
    })

    describe("removeFavorite", () => {
        it("retourne une erreur si le favori n'existe pas", async () => {
            favRepoMock.find.mockResolvedValue(null);

            const result = await service.removeFavorite(1, 10);

            expect(result).toEqual({
                success: false,
                message: "Ce favoris n'existe pas.",
            });
        });

        it("supprime un favori existant", async () => {
            favRepoMock.find.mockResolvedValue({ id: 99 });

            const result = await service.removeFavorite(1, 10);

            expect(favRepoMock.delete).toHaveBeenCalledWith(1, 10);
            expect(result).toEqual({
                success: true,
                message: "Favoris supprimé.",
            });
        });
    });

    describe("removeFavorite", () => {
        it("retourne une erreur si le favori n'existe pas", async () => {
            favRepoMock.find.mockResolvedValue(null);

            const result = await service.removeFavorite(1, 10);

            expect(result).toEqual({
                success: false,
                message: "Ce favoris n'existe pas.",
            });
        });

        it("supprime un favori existant", async () => {
            favRepoMock.find.mockResolvedValue({ id: 99 });

            const result = await service.removeFavorite(1, 10);

            expect(favRepoMock.delete).toHaveBeenCalledWith(1, 10);
            expect(result).toEqual({
                success: true,
                message: "Favoris supprimé.",
            });
        });
    });

      describe("getFavorite", () => {
    it("retourne un tableau vide si l'utilisateur n'existe pas", async () => {
      userRepoMock.findById.mockResolvedValue(null);

      const result = await service.getFavorite(1);

      expect(result).toEqual([]);
    });

    it("retourne la liste des favoris formatée", async () => {
      userRepoMock.findById.mockResolvedValue({ id: 1 });

      favRepoMock.findAllByUser.mockResolvedValue([
        {
          team: {
            id: 44,
            name: "OM",
            image_path: "om.png",
            competitions: [
              {
                competition: { id: 301, name: "Ligue 1" },
              },
            ],
          },
        },
      ]);

      const result = await service.getFavorite(1);

      expect(result).toEqual([
        {
          id: 44,
          name: "OM",
          emblem: "om.png",
          leagueId: 301,
          leagueName: "Ligue 1",
        },
      ]);
    });
  });

})