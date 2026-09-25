import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { teams } from './routes/teams';
import { competitions } from './routes/competitions';
import { standings } from './routes/standings';
import { users } from './routes/users';
import { scorers } from './routes/scorers';
import { favorites } from './routes/favorites';
import { serve, setup } from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { env } from './config';

export const app = express();

const siteName = env.netlifySiteName;
const previewRegex = siteName
  ? new RegExp(`^https:\\/\\/deploy-preview-\\d+--${siteName}\\.netlify\\.app$`)
  : null;

const allowedOrigins = env.allowedOrigins;

app.set('trust proxy', 1);

if (env.nodeEnv === 'development') {
  app.use('/api-docs', serve, setup(swaggerSpec));
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes(origin) ||
        (previewRegex ? previewRegex.test(origin) : false);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(teams);
app.use(competitions);
app.use(standings);
app.use(users);
app.use(scorers);
app.use(favorites);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express');
});

app.use(notFoundHandler);
app.use(errorHandler);
