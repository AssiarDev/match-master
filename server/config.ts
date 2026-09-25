import dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

/**
 * Reads an environment variable the server cannot run without.
 * Throws at startup, naming the variable, instead of failing later at the
 * point of use.
 * @param name - The name of the environment variable
 * @returns The variable's value, guaranteed non-empty
 */
const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

/** The log levels, from the most to the least verbose. */
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'silent'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

/**
 * Reads the optional LOG_LEVEL variable. Throws at startup on an unknown
 * value, so that a typo does not silently change what is logged.
 * @returns The configured level, 'info' when the variable is not set
 */
const logLevel = (): LogLevel => {
  const value = process.env.LOG_LEVEL;
  if (!value) return 'info';
  if (!(LOG_LEVELS as readonly string[]).includes(value))
    throw new Error(
      `Invalid LOG_LEVEL: ${value} (expected one of ${LOG_LEVELS.join(', ')})`
    );
  return value as LogLevel;
};

/**
 * Every environment variable read by the application, declared and checked
 * here only. The required ones are validated when this module is loaded;
 * the optional ones may be undefined.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: required('PORT'),
  secretKey: required('SECRET_KEY'),
  urlApi: required('URL_API'),
  apiToken: required('API_TOKEN'),
  netlifySiteName: process.env.NETLIFY_SITE_NAME,
  logLevel: logLevel(),
  allowedOrigins: [
    process.env.URL_SERVER_CLIENT,
    process.env.URL_SERVER_CLIENT_DEV,
    process.env.URL_PROD_CLIENT,
    process.env.URL_SWAGGER_CLIENT,
  ].filter((o): o is string => !!o),
} as const;

export const urlAPI: string = env.urlApi;
export const token: string = env.apiToken;
