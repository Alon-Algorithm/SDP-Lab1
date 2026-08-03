import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
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

  // Load tasks whenever showArchived toggles
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

  // ---- Create task ----
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

  // ---- Edit handlers ----
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

  // ---- Archive handler ----
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
      // Refresh the list – if showing archived, it will remain; if not, it will disappear.
      await fetchTasks();
    } catch (error) {
      setError(error.message);
    }
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

        {/* Toggle Archived */}
        <div style={{ marginBottom: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show archived tasks
          </label>
        </div>

        {/* Task List */}
        <div>
          <h2>Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p>No tasks yet. Create one above!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {tasks.map(task => (
                <li key={task.id} style={{
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: task.archived ? '#f0f0f0' : '#f9f9f9',
                  opacity: task.archived ? 0.7 : 1
                }}>
                  {editingId === task.id ? (
                    // Edit form (same as before)
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
                          {/* Edit button (only if not archived) */}
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
                          {/* Archive button (only if not archived) */}
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
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}