import { runScript } from '../scripts/runScript';
import { insertLeagues } from './insertLeagues';
import { insertAllSeasons } from './insertAllSeasons';
import { insertTeamsFromSeasons } from './insertTeamsFromSeasons';
import { insertTeamLeague } from './insertTeamLeague';
import { insertAllSquads } from './insertAllSquads';

/**
 * Runs the whole import in dependency order: leagues, seasons, teams, links
 * between teams and leagues, then squads.
 * Serves both the first import on an empty database and a full update: every
 * step upserts. Stops at the first failing step.
 */
export const importAll = async (): Promise<void> => {
  const steps = [
    insertLeagues,
    insertAllSeasons,
    insertTeamsFromSeasons,
    insertTeamLeague,
    insertAllSquads,
  ];
  for (const step of steps) {
    console.log(`\n=== ${step.name} ===`);
    await step();
  }
  console.log('\nImport completed');
};

runScript(import.meta.url, importAll);
