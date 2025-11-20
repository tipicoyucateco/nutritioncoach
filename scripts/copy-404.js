import { copyFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const source = join(rootDir, 'dist', 'index.html');
const destination = join(rootDir, 'dist', '404.html');

try {
  copyFileSync(source, destination);
  console.log('✓ Copiado index.html a 404.html');
} catch (error) {
  console.error('✗ Error al copiar 404.html:', error.message);
  process.exit(1);
}

