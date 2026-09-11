import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';

const file = fs.readFileSync(path.resolve('./openapi.yaml'), 'utf8');
export const swaggerSpec = load(file) as Record<string, unknown>;
