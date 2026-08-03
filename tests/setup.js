import fs from 'fs';
import path from 'path';
import db from '../lib/db.js';
import { initializeSchema } from '../lib/schema.js';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize schema before tests
initializeSchema();

export const cleanDb = () => {
  db.exec('DELETE FROM tasks');
  db.exec('DELETE FROM sqlite_sequence');
};

// Optional: after all tests, close db and delete file
export const closeAndCleanup = () => {
  db.close();
  // Optionally delete test.db
  // fs.unlinkSync(path.join(dataDir, 'test.db'));
};