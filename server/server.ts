import { app } from './app';

const requiredEnv = ['PORT', 'SECRET_KEY', 'URL_API', 'API_TOKEN'] as const;
for (const key of requiredEnv) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
