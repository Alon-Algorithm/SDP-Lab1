# Database Design

The application uses SQLite as its database engine. A single table, `tasks`, stores all task data.

## Schema

### `tasks` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier for each task |
| `title` | TEXT | NOT NULL | Task title |
| `description` | TEXT | | Optional description of the task |
| `due_date` | TEXT | NOT NULL | ISO-8601 date (YYYY-MM-DD) |
| `topic` | TEXT | NOT NULL | Task category or topic |
| `status` | TEXT | NOT NULL, CHECK(status IN ('Todo', 'In-Progress', 'Complete')) | Task state – fixed set of three non-customisable values |
| `archived` | INTEGER | DEFAULT 0 | 0 = active, 1 = archived |
| `archived_at` | DATETIME | | Timestamp when the task was archived (NULL if active) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Indexes

The following indexes are created for query performance:

| Index Name | Column(s) | Purpose |
|------------|-----------|---------|
| `idx_tasks_status` | `status` | Speeds up filtering and sorting by status |
| `idx_tasks_due_date` | `due_date` | Speeds up sorting by due date and overdue queries |
| `idx_tasks_topic` | `topic` | Speeds up filtering and sorting by topic |
| `idx_tasks_archived` | `archived` | Speeds up filtering active vs. archived tasks |

## Relationships

This is a flat table design – no foreign key relationships exist because the application serves a **single user** on the local machine. No user accounts, no multi-tenancy, and no relational complexity.

## Design Decisions

### Archiving (Soft Delete)
Tasks are never physically deleted. Instead, the `archived` flag is set to `1`, and the `archived_at` timestamp is recorded. This satisfies the requirement that tasks "cannot be deleted, only archived, so that it remains viewable."

### Overdue Derivation
Overdue status is **not stored** in the database. It is computed at render time using the `due_date` and the current date. This follows the spec requirement that overdue is "indicated in some way, but not as a status." The derivation logic:
A task is overdue if:

It has a due_date

Its status is NOT 'Complete'

The due_date is before today's date

text

### Status Values
The `CHECK` constraint enforces only three valid statuses: `'Todo'`, `'In-Progress'`, and `'Complete'`. These are fixed and not user-customisable, as required by the spec.
