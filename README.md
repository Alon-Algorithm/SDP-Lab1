# Todo Application

A local-first todo app built with Next.js and SQLite.
Runs locally on Node.js – no user accounts, no deployment.

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Alon-Algorithm/SDP-Lab1.git
cd SDP-Lab1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Run Tests

```bash
npm test
```

## Prerequisites

- Node.js v22.19.0 (the exact version used during development)
- npm (comes with Node.js)

## Documentation

Detailed documentation is available in the `docs/` folder:

- [Third-Party Code](docs/third-party-code.md) – Libraries and packages, with reasons for each choice.
- [Database Design](docs/database-design.md) – Table structure, columns, constraints, and design decisions.
- [Running It](docs/running-it.md) – Exact commands to install, run, and test.

## AI Transcripts

Full transcripts of AI interactions are available in the `ai/` folder. These demonstrate the planning, code generation, code review, and debugging process throughout development.

- [DeepSeek Transcript](ai/deepseek-full-transcript.pdf) – Detailed planning, implementation, and code review for Milestones 0–7.
- [Claude Transcript](ai/claude-full-transcript.pdf) – Design discussions, schema decisions, and milestone structuring.

## Features

- Create tasks with title, description, due date, topic, and status
- Edit existing tasks
- Archive tasks (soft delete – remain viewable)
- View active tasks in a sortable list
- Sort by topic, status, and due date
- Overdue indicator (derived, not stored)
- Persistent data storage (SQLite)
- Automated tests with Vitest

## Project Structure

```text
SDP-Lab1/
├── pages/
│   ├── api/
│   │   └── tasks/
│   │       └── index.js     # API routes (GET, POST, PUT, PATCH)
│   ├── index.js             # Main page with form and task list
│   └── _app.js
├── lib/
│   ├── db.js                # SQLite connection
│   ├── schema.js            # Database schema initialization
│   └── overdue.js           # Overdue derivation helper
├── tests/
│   ├── setup.js             # Test environment setup
│   ├── api.tasks.test.js    # API integration tests
│   └── overdue.test.js      # Overdue helper tests
├── docs/
│   ├── third-party-code.md
│   ├── database-design.md
│   └── running-it.md
├── ai/
│   ├── README.md
│   ├── deepseek-full-transcript.pdf
│   └── claude-full-transcript.pdf
├── data/
│   └── todo.db              # SQLite database (gitignored)
├── package.json
└── README.md
```

## Notes

- The SQLite database file is created automatically at `data/todo.db` on first run.
- The schema is initialized automatically on the first API call.
- Tests run against a separate throwaway database (`data/test.db`).

## License

This project is for educational purposes – part of a university assignment.
