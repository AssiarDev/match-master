import { app } from './app';
import { liveMatchesBroadcaster } from './lib/container';

const requiredEnv = ['PORT', 'SECRET_KEY', 'URL_API', 'API_TOKEN'] as const;
for (const key of requiredEnv) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/**
 * Graceful shutdown, on SIGTERM (sent by Render before a redeploy or a spin
 * down) and SIGINT (Ctrl+C in development).
 * The SSE connections are ended first, since they would otherwise keep
 * server.close() waiting forever; server.close() then stops accepting new
 * connections and lets the requests in progress finish before exiting.
 * @param signal - The name of the received signal, for the log
 */
const shutdown = (signal: string) => {
  console.log(`${signal} reçu, arrêt du serveur`);
  liveMatchesBroadcaster.closeAll();
  server.close(() => process.exit(0));
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
