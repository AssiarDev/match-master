/** Revoked tokens, each mapped to its expiry date (ms since epoch). */
const blacklist = new Map<string, number>();

/**
 * Revokes a token until it expires.
 * @param token - The JWT to revoke
 * @param exp - The token's `exp` claim, in seconds since epoch
 * @returns false if no token was given, true otherwise
 */
export const addToBlacklist = (token: string, exp: number) => {
  if (!token) return false;

  blacklist.set(token, exp * 1000);
  return true;
};

/**
 * Checks whether a token has been revoked. An expired entry is removed on the
 * way: past its expiry the token is rejected by jwt.verify anyway.
 * @param token - The JWT to check
 */
export const isBlacklisted = (token: string) => {
  const expiresAt = blacklist.get(token);
  if (expiresAt === undefined) return false;

  if (expiresAt <= Date.now()) {
    blacklist.delete(token);
    return false;
  }
  return true;
};

/**
 * Removes every expired entry, including tokens that are never checked again
 * (isBlacklisted only cleans up the ones it is asked about).
 */
export const purgeExpiredTokens = () => {
  const now = Date.now();
  for (const [token, expiresAt] of blacklist) {
    if (expiresAt <= now) blacklist.delete(token);
  }
};

/** Every 10 minutes. unref() lets the process exit without waiting for the timer. **/
setInterval(purgeExpiredTokens, 10 * 60 * 1000).unref();
