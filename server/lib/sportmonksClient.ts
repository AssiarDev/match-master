import { env } from '../config';

/**
 * Failure of a call to the SportMonks API: an error status from the API, a
 * network error or a timeout.
 * The upstream status is kept in `upstreamStatus`, not `status`: the final
 * errorHandler turns any `status` between 400 and 499 into a client error,
 * whereas a failing external API is a server error (500) for our client.
 */
export class SportmonksError extends Error {
  /**
   * @param path - The requested path, without the base URL
   * @param upstreamStatus - The HTTP status returned by SportMonks, undefined
   * for a network error or a timeout
   * @param options - The original error, when there is one
   */
  constructor(
    readonly path: string,
    readonly upstreamStatus?: number,
    options?: ErrorOptions
  ) {
    super(
      upstreamStatus
        ? `SportMonks API error ${upstreamStatus} on ${path}`
        : `SportMonks API unreachable on ${path}`,
      options
    );
    this.name = 'SportmonksError';
  }
}

/**
 * Single entry point for every call to the SportMonks API.
 * The token goes in the Authorization header, so it never appears in a URL,
 * and therefore never in a log or an error message. Every call is aborted
 * after 10 seconds.
 * @param path - The path and query string, e.g. `/leagues/8?include=seasons`
 * @returns The parsed JSON body
 * @throws {SportmonksError} On an error status, a network error or a timeout
 */
export const sportmonksGet = async <T>(path: string): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${env.urlApi}${path}`, {
      headers: { Authorization: env.apiToken },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (cause) {
    const error = new SportmonksError(path, undefined, { cause });
    console.error(error.message);
    throw error;
  }

  if (!response.ok) {
    const error = new SportmonksError(path, response.status);
    console.error(error.message);
    throw error;
  }

  return response.json();
};
