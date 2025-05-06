import pkg from 'pg';
import dotenv from 'dotenv'
dotenv.config();

const { Pool } = pkg;

// Connexion à la db 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL_LOCAL,
    ssl: false
})

export default pool;


