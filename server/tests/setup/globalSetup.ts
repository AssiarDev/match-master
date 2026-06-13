import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export default async function globalSetup() {
  const container = await new PostgreSqlContainer('postgres:17-alpine').start();

  const databaseUrl = container.getConnectionUri();

  process.env.DATABASE_URL = databaseUrl;
  process.env.SECRET_KEY = 'test-secret-key';
  process.env.URL_API = 'http://test-api.example.com';
  process.env.API_TOKEN = 'test-token';

  const configPath = join(tmpdir(), 'match-master-test-container.json');
  writeFileSync(configPath, JSON.stringify({ containerId: container.getId() }));

  execSync('npx prisma migrate deploy', {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  });
}
