import { jest } from '@jest/globals';
import prisma from '../../lib/prisma';
import { resetDb } from '../setup/resetDb';
import { parseLeagueId } from '../../scripts/delete-league';
import { findImportedLeagues } from '../../insert-db/importHelpers';
import { insertAllSquads } from '../../insert-db/insertAllSquads';
import {
  EXCLUDED_LEAGUE_IDS,
  insertLeagues,
} from '../../insert-db/insertLeagues';

/** A league as returned by SportMonks, with only the fields the import reads. */
const apiLeague = (id: number, name: string) => ({
  id,
  name,
  country_id: null,
  short_code: null,
  image_path: null,
  type: 'league',
  sub_type: null,
  last_played_at: null,
  category: 1,
});

describe('import scripts', () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('importing every script triggers neither an API call nor a write', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch');

    await import('../../insert-db/importAll');

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await prisma.competitions.count()).toBe(0);
  });

  describe('findImportedLeagues', () => {
    it('throws a message pointing to insertLeagues when the database has no league', async () => {
      await expect(findImportedLeagues()).rejects.toThrow(
        /run insert-db\/insertLeagues\.ts first/
      );
    });

    it('returns the leagues in the database', async () => {
      await prisma.competitions.create({
        data: { id: 10, name: 'Ligue 1', type: 'league', category: 1 },
      });

      const leagues = await findImportedLeagues();

      expect(leagues).toEqual([expect.objectContaining({ id: 10 })]);
    });
  });

  describe('insertLeagues', () => {
    it('does not import the excluded leagues', async () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      const [excludedId] = EXCLUDED_LEAGUE_IDS;
      jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            data: [apiLeague(8, 'Premier League'), apiLeague(excludedId, 'X')],
          }),
      } as Response);

      await insertLeagues();

      const ids = (await prisma.competitions.findMany()).map((c) => c.id);
      expect(ids).toEqual([8]);
    });
  });

  describe('insertAllSquads', () => {
    it('fails before any API call when the database has leagues but no team', async () => {
      const fetchSpy = jest.spyOn(globalThis, 'fetch');
      await prisma.competitions.create({
        data: { id: 10, name: 'Ligue 1', type: 'league', category: 1 },
      });

      await expect(insertAllSquads()).rejects.toThrow(
        /run insert-db\/insertTeamsFromSeasons\.ts first/
      );
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('delete-league parseLeagueId', () => {
    it('returns the league ID given on the command line', () => {
      expect(parseLeagueId(['1100'])).toBe(1100);
    });

    it.each<[string, string[]]>([
      ['a missing argument', []],
      ['a non-numeric argument', ['abc']],
      ['a negative ID', ['-3']],
      ['a decimal ID', ['1.5']],
    ])('throws the usage for %s', (_label, args) => {
      expect(() => parseLeagueId(args)).toThrow(
        /Usage: tsx scripts\/delete-league\.ts/
      );
    });
  });
});
