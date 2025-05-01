import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/db.js';
import { teams } from './routes/teams.js';
import { competitions } from './routes/competitions.js';
import { standings } from './routes/standings.js';
import { users } from './routes/users.js';

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
app.use(teams);
app.use(competitions);
app.use(standings)
app.use(users)

app.get('/', (req, res) => {
    res.send('Hello from Express');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})