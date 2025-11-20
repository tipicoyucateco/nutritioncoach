// Script para generar favicon.ico desde SVG
// Nota: Este script requiere sharp o puedes usar herramientas online
// Para usar: npm install sharp (opcional)
// O usa herramientas online como https://realfavicongenerator.net/

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('Para generar un favicon.ico desde el SVG:');
console.log('1. Usa https://realfavicongenerator.net/');
console.log('2. Sube el archivo public/favicon.svg');
console.log('3. Descarga el favicon.ico generado');
console.log('4. Colócalo en la carpeta public/');
console.log('');
console.log('O instala sharp y ejecuta este script con la lógica de conversión.');

