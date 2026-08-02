import Database from 'better-sqlite3';
import path from 'path';

// Store database in the data directory (already exists)
const dbPath = path.join(process.cwd(), 'data', 'todo.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;