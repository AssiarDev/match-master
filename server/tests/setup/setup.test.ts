import { resetDb } from './resetDb.js';

describe('database setup', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('la base de test est accessible et vide', async () => {
    await expect(resetDb()).resolves.not.toThrow();
  });
});
