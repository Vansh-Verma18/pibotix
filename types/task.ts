import { z } from "zod";

export const TaskPriorities = [
  "Low",
  "Medium",
  "High",
  "Critical"
] as const;

export const TaskStatuses = [
  "Backlog",
  "To Do",
  "In Progress",
  "Testing",
  "Under Review",
  "Blocked",
  "Completed"
] as const;

export const TaskZodSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string().min(5, "Task description is required"),
  projectId: z.string().min(10, "Project is required"),
  assignedEmployee: z.string().min(10, "Employee is required"),
  department: z.string().min(2, "Department is required"),
  priority: z.enum(TaskPriorities),
  status: z.enum(TaskStatuses).optional(),
  startDate: z.string().or(z.date()),
  dueDate: z.string().or(z.date()),
  estimatedHours: z.coerce.number().min(0).optional()
});

export type ITaskPayload = z.infer<typeof TaskZodSchema>;
