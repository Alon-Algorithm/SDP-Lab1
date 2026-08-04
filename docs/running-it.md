# Running It

This document provides exact instructions to install, run, and test the Todo application from a clean clone.

## Prerequisites

- **Node.js** v22.19.0 (the exact version used during development)
- **npm** (comes with Node.js)

## Installation

From a clean clone of the repository:

```bash
# Navigate to the project directory
cd todo-app

# Install dependencies
npm install
```

This will install all production and development dependencies listed in `package.json`.

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Development Notes

- The SQLite database file is created automatically at `data/todo.db` on first run.
- The schema is initialized automatically on the first API call.
- The server uses Next.js's development mode with hot reloading.

---

## Running Tests

The application includes automated tests covering creation, editing, archiving, and overdue derivation.

### Prerequisites for Testing

All test dependencies are included in the `devDependencies` of `package.json` and installed with `npm install`.

### Test Command

```bash
npm test
```

### What the Tests Cover

| Test File | Coverage |
|-----------|----------|
| `tests/api.tasks.test.js` | API endpoints: create, edit, archive, list (including archived) |
| `tests/overdue.test.js` | Overdue helper: date comparisons, completed tasks, missing dates |

### Test Environment

- All tests run against a throwaway SQLite database (`data/test.db`).
- The test database is automatically created and cleaned between test files.
- Tests are deterministic and do not interfere with development data.
