import dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

if (!process.env.URL_API) throw new Error('Missing required env var: URL_API');
if (!process.env.API_TOKEN)
  throw new Error('Missing required env var: API_TOKEN');

export const urlAPI: string = process.env.URL_API;
export const token: string = process.env.API_TOKEN;
