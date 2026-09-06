import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { config } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Universal SQLite driver resolution (node:sqlite on Node >= 22.5.0, better-sqlite3 on Node < 22)
let DatabaseSync;
try {
  const sqlite = await import('node:sqlite');
  if (sqlite && sqlite.DatabaseSync) {
    DatabaseSync = sqlite.DatabaseSync;
  }
} catch (e) {
  // Fallback for Node versions where node:sqlite is not available
}

if (!DatabaseSync) {
  try {
    DatabaseSync = require('better-sqlite3');
  } catch (err) {
    console.error('Failed to load SQLite driver:', err);
    throw new Error('No SQLite driver available. Please install better-sqlite3 or use Node >= 22.5.0');
  }
}

// Initialize SQLite database
export const db = new DatabaseSync(config.dbPath);

// Enable WAL mode and foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  // Execute schema definitions
  db.exec(schemaSql);
}

