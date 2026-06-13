import { execSync } from 'child_process';
import { readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export default async function globalTeardown() {
  const configPath = join(tmpdir(), 'match-master-test-container.json');

  try {
    const { containerId } = JSON.parse(readFileSync(configPath, 'utf8'));
    execSync(`docker stop ${containerId} && docker rm ${containerId}`, {
      stdio: 'inherit',
    });
    unlinkSync(configPath);
  } catch (err) {
    console.error("Échec de l'arrêt du conteneur de test :", err);
  }
}
