import db from '../../../lib/db.js';
import { initializeSchema } from '../../../lib/schema.js';

// Ensure schema exists
initializeSchema();

export default function handler(req, res) {
  // ---- PUT (update) with query param ?id ----
  if (req.method === 'PUT' && req.query.id) {
    const id = req.query.id;
    const { title, description, due_date, topic, status } = req.body;

    // Validation
    if (!title || !due_date || !topic) {
      return res.status(400).json({ error: 'Title, due date, and topic are required' });
    }

    const validStatuses = ['Todo', 'In-Progress', 'Complete'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Todo, In-Progress, or Complete' });
    }

    try {
      // Check if task exists
      const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Update task
      const stmt = db.prepare(`
        UPDATE tasks 
        SET title = ?, description = ?, due_date = ?, topic = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(title, description, due_date, topic, status, id);

      // Return updated task
      const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
      return res.status(200).json(updated);
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // ---- GET (list tasks) ----
  if (req.method === 'GET') {
    try {
      const tasks = db.prepare('SELECT * FROM tasks WHERE archived = 0 ORDER BY created_at DESC').all();
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // ---- POST (create task) ----
  if (req.method === 'POST') {
    const { title, description, due_date, topic, status = 'Todo' } = req.body;

    if (!title || !due_date || !topic) {
      return res.status(400).json({ error: 'Title, due date, and topic are required' });
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO tasks (title, description, due_date, topic, status)
        VALUES (?, ?, ?, ?, ?)
      `);
      const info = stmt.run(title, description, due_date, topic, status);
      const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // ---- Method not allowed ----
  res.status(405).json({ error: 'Method not allowed' });
}