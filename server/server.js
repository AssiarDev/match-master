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
import { update } from './routes/cron.js';

const app = express();

console.log('ENV:', process.env.NODE_ENV);
console.log('Base chargée :', process.env.DATABASE_URL);

const port = process.env.PORT;
const urlServerClient = process.env.URL_SERVER_CLIENT;

const corsOptions = {
  origin: [urlServerClient, 'https://mastermaster.netlify.app'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 3600000,
    },
  })
);

app.use(teams);
app.use(competitions);
app.use(standings);
app.use(users);
app.use(protectedRoutes);
app.use(scorers);
app.use(favorites);
app.use(update);

app.get('/', (req, res) => {
  res.send('Hello from Express');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
