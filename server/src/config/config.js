import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.JWT_SECRET) {
  if (isProduction) {
    throw new Error('JWT_SECRET must be set in production');
  }
  // ponytail: random per-process secret in dev, so sessions reset on restart; set JWT_SECRET to keep them
  console.warn('⚠️  JWT_SECRET not set, using a random secret for this run');
}

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
  jwtExpiresIn: '7d',
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../../database.sqlite'),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminEmails: (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean),
};
