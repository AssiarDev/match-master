const blacklist = new Set<string>();

export const addToBlacklist = (token: string) => {
  if (!token) return false;

  blacklist.add(token);
  return true;
};
export const isBlacklisted = (token: string) => blacklist.has(token);
