import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { teams } from './routes/teams.js';
import { competitions } from './routes/competitions.js';
import { standings } from './routes/standings.js';
import { users } from './routes/users.js';
import { login } from './routes/login.js';
import { register } from './routes/register.js';
import { logout } from './routes/logout.js';
import { protectedRoutes } from './routes/protected.js'

const app = express();

//const envFile = process.env.NODE_ENV === "development" ? ".env.development" : ".env.production";
const env = (process.env.NODE_ENV || 'development').trim();
switch (env){
    case 'development':
        dotenv.config({ path: '.env.development' });
    break;
    case 'production':
        dotenv.config({ path: '.env.production' });
    break;
    default:
        console.log("Valeur inconnue pour NODE_ENV :", env);
        throw new Error(`Unknown environment: ${env}`);
}

// console.log('EnvFile :', envFile)
console.log('ENV:', process.env.NODE_ENV)
console.log("Base chargée :", process.env.DATABASE_URL);

const port = process.env.PORT;
const urlServerClient = process.env.URL_SERVER_CLIENT;

const corsOptions = {
    origin: urlServerClient,
    credentials: true
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_KEY, 
    resave: false, 
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        maxAge: 3600000 
    } 
}));

app.use(teams);
app.use(competitions);
app.use(standings);
app.use(users);
app.use(login);
app.use(register);
app.use(logout);
app.use(protectedRoutes)

app.get('/', (req, res) => {
    res.send('Hello from Express');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})