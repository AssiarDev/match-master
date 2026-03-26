import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { teams } from './routes/teams';
import { competitions } from './routes/competitions';
import { standings } from './routes/standings';
import { users } from './routes/users';
import { protectedRoutes } from './routes/protected';
import { scorers } from './routes/scorers';
import { favorites } from './routes/favorites';

const requiredEnv = ['PORT', 'SESSION_KEY', 'SECRET_KEY'] as const;
for (const key of requiredEnv) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

const app = express();
const port = process.env.PORT;

const allowedOrigins = [
  process.env.URL_SERVER_CLIENT,
  process.env.URL_PROD_CLIENT,
];

app.set('trust proxy', 1);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
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

app.use(
  session({
    secret: process.env.SESSION_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 3600000, sameSite: 'none' },
  })
);

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
