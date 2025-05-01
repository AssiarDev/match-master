import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { initializeDatabase } from './db/db.js';
import { teams } from './routes/teams.js';
import { competitions } from './routes/competitions.js';
import { standings } from './routes/standings.js';
import { users } from './routes/users.js';
import { login } from './routes/login.js';
import { logout } from './routes/logout.js';

const app = express();
const port = process.env.PORT;
const urlServerClient = process.env.URL_SERVER_CLIENT;
const urlDb = process.env.URL_DB;

// Intégration de ma db
export const db = initializeDatabase(urlDb);

const corsOptions = {
    origin: [urlServerClient, `http://localhost:${port}`]
};

app.use(cors(corsOptions))
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_KEY, 
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 } 
}));

app.use(teams);
app.use(competitions);
app.use(standings);
app.use(users);
app.use(login);
app.use(logout)

app.get('/', (req, res) => {
    res.send('Hello from Express');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})