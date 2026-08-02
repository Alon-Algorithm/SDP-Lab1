import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    topic: '',
    status: 'todo'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load tasks on page load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

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

      // Reset form
      setForm({
        title: '',
        description: '',
        due_date: '',
        topic: '',
        status: 'todo'
      });
      
      // Refresh task list
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

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Todo application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>Todo App</h1>
        
        {/* Error message */}
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
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="complete">Complete</option>
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
                  backgroundColor: '#f9f9f9'
                }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{task.title}</h3>
                  {task.description && <p style={{ margin: '5px 0' }}>{task.description}</p>}
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <span>Due: {task.due_date}</span> | 
                    <span> Topic: {task.topic}</span> | 
                    <span> Status: {task.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}