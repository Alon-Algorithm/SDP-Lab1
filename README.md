# Todo Application

A local‑first todo app built with Next.js and SQLite.  
Runs locally on Node.js – no user accounts, no deployment.

---

## Third‑Party Code

| Package | Version | Reason |
|---------|---------|--------|
| `better-sqlite3` | ^13.0.2 | Synchronous SQLite driver – simple, performant, and well‑suited for a single‑user local app. |
| `next` | 16.2.12 | React framework with API routes and server‑side rendering for a clean structure. |
| `react` & `react-dom` | 19.2.4 | UI library for building interactive components. |
| `eslint` & `eslint-config-next` | ^9 / 16.2.12 | Code linting to maintain quality and consistency. |
| `vitest` | ^4.1.10 | Fast test runner with native ESM support, used for unit and API tests. |
| `node-mocks-http` | ^1.18.1 | Simulates HTTP requests/responses for testing API handlers without a network. |
| `cross-env` | ^7.0.3 | Cross‑platform environment variable setting for test scripts. |

---

## Database Design

The application uses a single SQLite table: **tasks**.

### `tasks` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique task identifier |
| `title` | TEXT | NOT NULL | Task title |
| `description` | TEXT | | Optional description |
| `due_date` | TEXT | NOT NULL | ISO‑8601 date (YYYY‑MM‑DD) |
| `topic` | TEXT | NOT NULL | Task category / topic |
| `status` | TEXT | NOT NULL, CHECK(status IN ('Todo','In‑Progress','Complete')) | Task state – fixed set of three values |
| `archived` | INTEGER | DEFAULT 0 | 0 = active, 1 = archived |
| `archived_at` | DATETIME | | Timestamp when archived (null if active) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes** – created for performance on sorting/filtering columns:
- `idx_tasks_status` on `status`
- `idx_tasks_due_date` on `due_date`
- `idx_tasks_topic` on `topic`
- `idx_tasks_archived` on `archived`

**Relationships** – none; this is a flat table for a single user.

**Overdue derivation** – Overdue status is **not stored**. It is computed at render time:
```javascript
const isOverdue = (task) => {
  if (!task.due_date) return false;
  if (task.status === 'Complete') return false;
  return new Date(task.due_date) < new Date().setHours(0,0,0,0);
};

## Running It
Prerequisites
Node.js v22.19.0 (the exact version used during development)

*** Install Dependencies ***
bash
npm install
Run the Development Server
bash
npm run dev
Then open http://localhost:3000 in your browser.

***Run Tests***
bash
npm test
All tests run against a separate throwaway database (data/test.db) and are deterministic.

**Notes**
The database file is stored in data/todo.db (and data/test.db for tests).

The schema is automatically initialized when the server starts or on the first API call.

Tasks are never deleted – they are only archived (soft delete).

Sorting is done client‑side; the API returns tasks unsorted (except by created_at for a stable baseline).

***License**
This project is for educational purposes – part of a university assignment.

