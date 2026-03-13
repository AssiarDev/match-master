import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { teams } from './routes/teams.js';
import { competitions } from './routes/competitions.js';
import { standings } from './routes/standings.js';
import { users } from './routes/users.js';
import { protectedRoutes } from './routes/protected.js';
import { scorers } from './routes/scorers.js';
import { favorites } from './routes/favorites.js';

const app = express();

const port = process.env.PORT;

const allowedOrigins = [
  process.env.URL_SERVER_CLIENT,
  process.env.URL_PROD_CLIENT
];

app.set('trust proxy', 1);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 3600000,
      sameSite: 'none',
    },
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(teams);
app.use(competitions);
app.use(standings);
app.use(users);
app.use(protectedRoutes);
app.use(scorers);
app.use(favorites);

app.get('/', (req, res) => {
  res.send('Hello from Express');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
