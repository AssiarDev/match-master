import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});

export const urlAPI: string | undefined = process.env.URL_API;
export const token: string | undefined = process.env.API_TOKEN;
