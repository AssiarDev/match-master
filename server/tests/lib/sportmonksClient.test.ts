import { jest } from '@jest/globals';
import { env } from '../../config';
import { SportmonksError, sportmonksGet } from '../../lib/sportmonksClient';

/** Stubs the global fetch with a single response. */
const mockFetch = (init: { ok: boolean; status?: number; body?: unknown }) =>
  jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: init.ok,
    status: init.status ?? 200,
    json: () => Promise.resolve(init.body),
  } as Response);

/** Runs the call and returns the error it rejects with. */
const rejectionOf = async (call: Promise<unknown>) => {
  try {
    await call;
  } catch (error) {
    return error;
  }
  throw new Error('The call should have failed');
};

describe('sportmonksClient', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the base URL followed by the path and returns the JSON', async () => {
    const fetchSpy = mockFetch({ ok: true, body: { data: [1, 2] } });

    const result = await sportmonksGet('/leagues/8?include=seasons');

    expect(result).toEqual({ data: [1, 2] });
    expect(fetchSpy).toHaveBeenCalledWith(
      `${env.urlApi}/leagues/8?include=seasons`,
      expect.anything()
    );
  });

  it('sends the token in the Authorization header, never in the URL', async () => {
    const fetchSpy = mockFetch({ ok: true, body: {} });

    await sportmonksGet('/leagues');

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).not.toContain('api_token');
    expect(url).not.toContain(env.apiToken);
    expect(init.headers).toEqual({ Authorization: env.apiToken });
  });

  it('passes a signal that aborts the call after the timeout', async () => {
    const fetchSpy = mockFetch({ ok: true, body: {} });

    await sportmonksGet('/leagues');

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('throws a SportmonksError with upstreamStatus and no status property', async () => {
    mockFetch({ ok: false, status: 404 });

    const error = await rejectionOf(sportmonksGet('/leagues/999'));

    expect(error).toBeInstanceOf(SportmonksError);
    expect(error).toMatchObject({ path: '/leagues/999', upstreamStatus: 404 });
    expect(error).not.toHaveProperty('status');
  });

  it('wraps a network error without exposing the token', async () => {
    const cause = new Error('fetch failed');
    jest.spyOn(globalThis, 'fetch').mockRejectedValueOnce(cause);

    const error = await rejectionOf(sportmonksGet('/leagues'));

    expect(error).toBeInstanceOf(SportmonksError);
    expect(error).toMatchObject({ upstreamStatus: undefined, cause });
    expect((error as Error).message).not.toContain(env.apiToken);
  });
});
