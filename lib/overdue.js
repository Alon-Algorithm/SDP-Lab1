// Helper to check if a task is overdue
export const isTaskOverdue = (task) => {
  if (!task.due_date) return false;
  if (task.status === 'Complete') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.due_date);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};