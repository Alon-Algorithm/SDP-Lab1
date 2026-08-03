import Database from 'better-sqlite3';
import path from 'path';

// Determine database path based on environment
const getDbPath = () => {
  if (process.env.NODE_ENV === 'test') {
    // Use a separate test database
    return path.join(process.cwd(), 'data', 'test.db');
  }
  return path.join(process.cwd(), 'data', 'todo.db');
};

const dbPath = getDbPath();
const db = new Database(dbPath);

// Enable WAL and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;