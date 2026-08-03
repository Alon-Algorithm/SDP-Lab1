import { describe, it, expect } from 'vitest';
import { isTaskOverdue } from '../lib/overdue.js';

describe('isTaskOverdue', () => {
  it('should return true for a past due date and incomplete status', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const task = {
      due_date: pastDate.toISOString().split('T')[0],
      status: 'Todo'
    };
    expect(isTaskOverdue(task)).toBe(true);
  });

  it('should return false for a future due date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const task = {
      due_date: futureDate.toISOString().split('T')[0],
      status: 'Todo'
    };
    expect(isTaskOverdue(task)).toBe(false);
  });

  it('should return false for a past due date but status Complete', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const task = {
      due_date: pastDate.toISOString().split('T')[0],
      status: 'Complete'
    };
    expect(isTaskOverdue(task)).toBe(false);
  });

  it('should return false if due_date is missing', () => {
    const task = { status: 'Todo' };
    expect(isTaskOverdue(task)).toBe(false);
  });
});