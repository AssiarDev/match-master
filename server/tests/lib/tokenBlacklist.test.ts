import { jest } from '@jest/globals';
import {
  addToBlacklist,
  isBlacklisted,
  purgeExpiredTokens,
} from '../../lib/tokenBlacklist';

const NOW = new Date('2026-09-18T12:00:00Z');
const AFTER_ONE_HOUR = new Date('2026-09-18T13:00:01Z');

/** `exp` claim (seconds since epoch) of a token issued now, valid for one hour. */
const expInOneHour = () => Math.floor(Date.now() / 1000) + 3600;

describe('tokenBlacklist', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("retourne false s'il n'y a pas de token", () => {
    const result = addToBlacklist('', expInOneHour());
    expect(result).toEqual(false);
  });

  it("refuse un token révoqué tant qu'il n'est pas expiré", () => {
    addToBlacklist('revoked-token', expInOneHour());
    expect(isBlacklisted('revoked-token')).toEqual(true);
  });

  it("ne signale pas un token qui n'a pas été révoqué", () => {
    expect(isBlacklisted('unknown-token')).toEqual(false);
  });

  it('oublie un token une fois son expiration passée', () => {
    jest.useFakeTimers({ now: NOW });
    addToBlacklist('expiring-token', expInOneHour());

    jest.setSystemTime(AFTER_ONE_HOUR);

    expect(isBlacklisted('expiring-token')).toEqual(false);
  });

  it('purge les entrées expirées et garde les autres', () => {
    jest.useFakeTimers({ now: NOW });
    addToBlacklist('expired-token', expInOneHour());
    addToBlacklist('still-valid-token', expInOneHour() + 3600);

    jest.setSystemTime(AFTER_ONE_HOUR);
    purgeExpiredTokens();
    jest.setSystemTime(NOW);

    expect(isBlacklisted('expired-token')).toEqual(false);
    expect(isBlacklisted('still-valid-token')).toEqual(true);
  });
});
