import db from '../../../lib/db.js';
import { initializeSchema } from '../../../lib/schema.js';

// Initialize schema on first API call
initializeSchema();

export default function handler(req, res) {
  if (req.method === 'GET') {
    const tasks = db.prepare('SELECT * FROM tasks WHERE archived = 0').all();
    res.status(200).json(tasks);
  } else if (req.method === 'POST') {
    // Create task logic
    const { title, description, due_date, topic, status } = req.body;
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, due_date, topic, status)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, description, due_date, topic, status);
    res.status(201).json({ id: info.lastInsertRowid });
  }
}