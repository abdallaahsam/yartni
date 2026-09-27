import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';
import { config } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize native SQLite database from Node.js stdlib
export const db = new DatabaseSync(config.dbPath);

// Enable WAL mode and foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);

  // Migration for databases created before moderation existed
  const adviceColumns = db.prepare('PRAGMA table_info(advices)').all().map(c => c.name);
  if (!adviceColumns.includes('is_hidden')) {
    db.exec('ALTER TABLE advices ADD COLUMN is_hidden INTEGER DEFAULT 0');
  }
}

export function isEmpty() {
  return db.prepare('SELECT COUNT(*) as count FROM categories').get().count === 0;
}
