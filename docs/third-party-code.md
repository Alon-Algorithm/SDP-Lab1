# Third-Party Code

This document lists all external libraries and packages used in the Todo application, along with the rationale for each choice.

## Production Dependencies

| Package | Version | Reason |
|---------|---------|--------|
| **better-sqlite3** | ^13.0.2 | Synchronous SQLite driver chosen for its simplicity, performance, and ergonomic API. The synchronous style fits a single-user local application perfectly – no concurrency concerns, and synchronous code is easier to reason about and test than promise-based async queries. Widely adopted in the Node ecosystem with extensive documentation. |
| **next** | 16.2.12 | React framework providing API routes and server-side rendering. Chosen for its clean project structure, built-in routing, and ability to serve both API endpoints and UI from a single codebase. |
| **react** | 19.2.4 | UI library for building interactive components. Chosen for its component-based architecture, declarative syntax, and ecosystem support. |
| **react-dom** | 19.2.4 | React's rendering library for the browser, required to render React components in the DOM. |

## Development Dependencies

| Package | Version | Reason |
|---------|---------|--------|
| **cross-env** | ^7.0.3 | Cross-platform environment variable setting for npm scripts. Ensures `NODE_ENV=test` works consistently on Windows, macOS, and Linux without platform-specific syntax. |
| **eslint** | ^9 | JavaScript linting to maintain code quality and catch potential errors early. |
| **eslint-config-next** | 16.2.12 | Next.js-specific ESLint configuration that enforces best practices for Next.js applications. |
| **node-mocks-http** | ^1.18.1 | Simulates HTTP requests and responses for testing API handlers without actually starting a server. Allows unit testing of API routes in isolation. |
| **vitest** | ^4.1.10 | Fast, modern test runner with native ESM support. Chosen for its speed, Jest-compatible API, and seamless integration with the project's ES modules. |
