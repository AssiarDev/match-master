import { jest } from '@jest/globals';

jest.unstable_mockModule('dotenv', () => ({
  default: { config: jest.fn() },
}));

/**
 * Loads config.ts from scratch: the env is validated when the module is
 * evaluated, so each test needs a fresh copy. dotenv is mocked so that a
 * variable removed by a test is not restored from a local .env file.
 */
const loadConfig = async () => {
  let config: typeof import('../config') | undefined;
  await jest.isolateModulesAsync(async () => {
    config = await import('../config');
  });
  return config!;
};

describe('config', () => {
  const initialEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...initialEnv };
  });

  it('expose les variables requises quand elles sont définies', async () => {
    const { env } = await loadConfig();

    expect(env.secretKey).toBe(process.env.SECRET_KEY);
    expect(env.port).toBe(process.env.PORT);
  });

  it.each(['PORT', 'SECRET_KEY', 'URL_API', 'API_TOKEN'])(
    'refuse de charger si %s est absente, en la nommant',
    async (name) => {
      delete process.env[name];

      await expect(loadConfig()).rejects.toThrow(
        `Missing required env var: ${name}`
      );
    }
  );

  it('refuse une variable requise définie mais vide', async () => {
    process.env.SECRET_KEY = '';

    await expect(loadConfig()).rejects.toThrow(
      'Missing required env var: SECRET_KEY'
    );
  });

  it('ne garde que les origines client définies', async () => {
    process.env.URL_SERVER_CLIENT = 'https://client-dev.test';
    process.env.URL_PROD_CLIENT = 'https://client-prod.test';
    delete process.env.URL_SERVER_CLIENT_DEV;
    delete process.env.URL_SWAGGER_CLIENT;

    const { env } = await loadConfig();

    expect(env.allowedOrigins).toEqual([
      'https://client-dev.test',
      'https://client-prod.test',
    ]);
  });
});
