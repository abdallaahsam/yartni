import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'yareetni-super-secret-jwt-key-2026',
  jwtExpiresIn: '7d',
  dbPath: path.resolve(__dirname, '../../database.sqlite'),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
