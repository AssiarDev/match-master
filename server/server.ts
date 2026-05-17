import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { teams } from './routes/teams';
import { competitions } from './routes/competitions';
import { standings } from './routes/standings';
import { users } from './routes/users';
import { protectedRoutes } from './routes/protected';
import { scorers } from './routes/scorers';
import { favorites } from './routes/favorites';
import {serve, setup } from 'swagger-ui-express'
import { swaggerSpec } from './swagger';
import { liveMatchesBroadcaster } from './lib/container';

const requiredEnv = [
  'PORT',
  'SECRET_KEY',
  'URL_API',
  'API_TOKEN',
] as const;
for (const key of requiredEnv) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

const app = express();
const port = process.env.PORT;

const siteName = process.env.NETLIFY_SITE_NAME
const previewRegex = siteName ? new RegExp(`^https:\\/\\/deploy-preview-\\d+--${siteName}\\.netlify\\.app$`) : null

const allowedOrigins = [
  process.env.URL_SERVER_CLIENT,
  process.env.URL_SERVER_CLIENT_DEV,
  process.env.URL_PROD_CLIENT,
  process.env.URL_SWAGGER_CLIENT
].filter((o): o is string => !!o);

app.set('trust proxy', 1);

if (process.env.NODE_ENV === 'development'){
  app.use('/api-docs', serve, setup(swaggerSpec))
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || 
        (previewRegex ? previewRegex.test(origin) : false)

      if(isAllowed){
        callback(null, true)
      } else {
        callback(new Error(`CORS error: origin ${origin} not allowed`))
      }
    },
    credentials: true,
  })
);

liveMatchesBroadcaster.start()

app.use(express.json());
app.use(cookieParser());

app.use(teams);
app.use(competitions);
app.use(standings);
app.use(users);
app.use(protectedRoutes);
app.use(scorers);
app.use(favorites);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
