import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { isTaskOverdue } from '../lib/overdue.js';

// Helper: order of statuses for sorting
const STATUS_ORDER = { 'Todo': 0, 'In-Progress': 1, 'Complete': 2 };

// Helper: check if a task is overdue
const isTaskOverdue = (task) => {
  if (!task.due_date) return false;
  if (task.status === 'Complete') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.due_date);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState('due_date');
  const [sortOrder, setSortOrder] = useState('asc');

  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    topic: '',
    status: 'Todo'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    due_date: '',
    topic: '',
    status: 'Todo'
  });

  useEffect(() => {
    fetchTasks();
  }, [showArchived]);

  const fetchTasks = async () => {
    try {
      const url = showArchived ? '/api/tasks?includeArchived=true' : '/api/tasks';
      const res = await fetch(url);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // ---- Sorting ----
  const sortedTasks = useMemo(() => {
    const tasksCopy = [...tasks];
    const compare = (a, b) => {
      let valA, valB;
      if (sortBy === 'topic') {
        valA = (a.topic || '').toLowerCase();
        valB = (b.topic || '').toLowerCase();
      } else if (sortBy === 'status') {
        valA = STATUS_ORDER[a.status] ?? 0;
        valB = STATUS_ORDER[b.status] ?? 0;
      } else if (sortBy === 'due_date') {
        const timeA = a.due_date ? new Date(a.due_date).getTime() : (sortOrder === 'asc' ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER);
        const timeB = b.due_date ? new Date(b.due_date).getTime() : (sortOrder === 'asc' ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER);
        valA = timeA;
        valB = timeB;
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    };
    return tasksCopy.sort(compare);
  }, [tasks, sortBy, sortOrder]);

  // ---- Create ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create task');
      }

      setForm({
        title: '',
        description: '',
        due_date: '',
        topic: '',
        status: 'Todo'
      });

      await fetchTasks();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---- Edit ----
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      due_date: task.due_date,
      topic: task.topic,
      status: task.status
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/tasks?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update task');
      }

      setEditingId(null);
      await fetchTasks();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- Archive ----
  const handleArchive = async (id) => {
    if (!confirm('Archive this task? It will be hidden from the active list.')) return;
    try {
      const res = await fetch(`/api/tasks?id=${id}&action=archive`, {
        method: 'PATCH'
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to archive task');
      }
      await fetchTasks();
    } catch (error) {
      setError(error.message);
    }
  };

  // ---- Toggle sort order ----
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Todo application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>Todo App</h1>

        {error && (
          <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        {/* Create Task Form */}
        <form onSubmit={handleSubmit} style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2>Create New Task</h2>

          <div style={{ marginBottom: '10px' }}>
            <label>
              Title: *
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>
              Description:
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>
              Due Date: *
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>
              Topic: *
              <input
                type="text"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>
              Status:
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Todo">Todo</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Complete">Complete</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>

        {/* Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
          <label>
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show archived tasks
          </label>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label>
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ marginLeft: '4px', padding: '4px' }}
              >
                <option value="topic">Topic</option>
                <option value="status">Status</option>
                <option value="due_date">Due Date</option>
              </select>
            </label>
            <button
              onClick={toggleSortOrder}
              style={{
                padding: '4px 10px',
                cursor: 'pointer',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: '#f0f0f0'
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Task List */}
        <div>
          <h2>Tasks ({sortedTasks.length})</h2>
          {sortedTasks.length === 0 ? (
            <p>No tasks yet. Create one above!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {sortedTasks.map(task => {
                const overdue = isTaskOverdue(task);
                return (
                  <li key={task.id} style={{
                    padding: '15px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: task.archived ? '#f0f0f0' : (overdue ? '#fff0f0' : '#f9f9f9'),
                    opacity: task.archived ? 0.7 : 1,
                    borderColor: overdue ? '#dc3545' : '#ddd'
                  }}>
                    {editingId === task.id ? (
                      // Edit form
                      <form onSubmit={handleEditSubmit}>
                        <h3>Edit Task</h3>
                        <div style={{ marginBottom: '10px' }}>
                          <label>
                            Title: *
                            <input
                              type="text"
                              name="title"
                              value={editForm.title}
                              onChange={handleEditChange}
                              required
                              style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <label>
                            Description:
                            <textarea
                              name="description"
                              value={editForm.description}
                              onChange={handleEditChange}
                              style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <label>
                            Due Date: *
                            <input
                              type="date"
                              name="due_date"
                              value={editForm.due_date}
                              onChange={handleEditChange}
                              required
                              style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <label>
                            Topic: *
                            <input
                              type="text"
                              name="topic"
                              value={editForm.topic}
                              onChange={handleEditChange}
                              required
                              style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <label>
                            Status:
                            <select
                              name="status"
                              value={editForm.status}
                              onChange={handleEditChange}
                              style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="Todo">Todo</option>
                              <option value="In-Progress">In-Progress</option>
                              <option value="Complete">Complete</option>
                            </select>
                          </label>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            type="submit"
                            disabled={loading}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              opacity: loading ? 0.7 : 1
                            }}
                          >
                            {loading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      // View mode
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ margin: '0 0 5px 0' }}>
                              {/* Overdue Badge */}
                              {overdue && (
                                <span style={{
                                  display: 'inline-block',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  padding: '2px 10px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  marginRight: '8px'
                                }}>
                                  ⚠️ Overdue!
                                </span>
                              )}
                              {task.title}
                              {task.archived && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#999' }}>(Archived)</span>}
                            </h3>
                            {task.description && <p style={{ margin: '5px 0' }}>{task.description}</p>}
                            <div style={{ fontSize: '14px', color: '#666' }}>
                              <span>Due: {task.due_date}</span> |
                              <span> Topic: {task.topic}</span> |
                              <span> Status: {task.status}</span>
                              {task.archived_at && <span> | Archived: {new Date(task.archived_at).toLocaleDateString()}</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {!task.archived && (
                              <button
                                onClick={() => startEdit(task)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#ffc107',
                                  color: '#000',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Edit
                              </button>
                            )}
                            {!task.archived && (
                              <button
                                onClick={() => handleArchive(task.id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Archive
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}