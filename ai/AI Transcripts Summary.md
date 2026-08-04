# AI Transcripts

This folder contains full transcripts of AI interactions during the development of the Todo application.

## Transcripts

### [DeepSeek Transcript](./deepseek-full-transcript.pdf)
**AI Model:** DeepSeek (DeepThink Mode)  
**Scope:** Milestones 0–7 (Planning, Implementation, Code Review, Debugging)

**Key interactions include:**

| Topic | Description |
|-------|-------------|
| **Milestone Planning** | Detailed breakdown of M0–M8 with test conditions for each |
| **M2 Implementation** | Plan, implement, and review task creation and listing |
| **Professional Code Review** | My implementation was reviewed on correctness, best practices, and maintainability |
| **Fixes Applied** | Status casing correction, error handling for initial load, database constraint fixes |
| **M3–M4 Planning** | Structured approaches for Edit and Archive features |
| **M5–M6 Planning** | Sorting and Overdue derivation implementation plans |
| **Debugging** | Dynamic route 404 issue, CHECK constraint errors, and query parameter solution |

---

### [Claude Transcript](./claude-full-transcript.pdf)
**AI Model:** Claude (Sonnet 3.5)  
**Scope:** Design Discussions, Schema Decisions, Milestone Structuring

**Key interactions include:**

| Topic | Description |
|-------|-------------|
| **Routing Decision** | Pages Router vs App Router – chose Pages Router for explicitness |
| **Database Schema Design** | Topic as text column vs separate table – chose text column for simplicity |
| **Archived Representation** | Archived_at timestamp vs boolean flag – chose boolean flag after reconsideration |
| **Milestone Breakdown** | Vertical slice approach (M0–M8) with test gates between each |
| **Scaffolding** | Project setup, folder structure, and initial commit guidance |
| **Mentoring Approach** | AI acted as senior engineer – explaining trade-offs before code |

---

## How to Use These Transcripts

1. **Planning Evidence** – Shows how requirements were broken down into milestones
2. **Design Rationale** – Documents why specific architectural decisions were made
3. **Code Quality** – Demonstrates code review process and iterative improvements
4. **Prompting Quality** – Shows how I constrained the AI, asked for explanations, and rejected incorrect suggestions

---

## Transcript Format

Both transcripts are provided as PDFs to preserve formatting, code blocks, and the full conversation history. The DeepSeek transcript is particularly detailed (90+ pages) and covers the majority of implementation work.
Git Commands
bash
# Create the ai README
# (copy the content above into ai/README.md)

# Stage and commit
git add ai/README.md
git commit -m "docs: add AI folder README summarizing transcripts"
git push
Final ai/ Folder Structure
ai/
├── README.md                          # Summary of all transcripts
├── deepseek-full-transcript.pdf        # Full DeepSeek conversation
└── claude-full-transcript.pdf          # Full Claude conversation
