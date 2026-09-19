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
  allowedOrigins: [
    process.env.URL_SERVER_CLIENT,
    process.env.URL_SERVER_CLIENT_DEV,
    process.env.URL_PROD_CLIENT,
    process.env.URL_SWAGGER_CLIENT,
  ].filter((o): o is string => !!o),
} as const;

export const urlAPI: string = env.urlApi;
export const token: string = env.apiToken;
