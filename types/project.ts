import { z } from "zod";

export const ProjectCategories = [
  "Industrial Automation",
  "Robotics",
  "PLC Programming",
  "SCADA",
  "Machine Vision",
  "AI Inspection",
  "IIoT",
  "Predictive Maintenance"
] as const;

export const ProjectPriorities = [
  "Low",
  "Medium",
  "High",
  "Critical"
] as const;

export const ProjectStatuses = [
  "Planning",
  "Not Started",
  "In Progress",
  "Testing",
  "Review",
  "Completed",
  "On Hold",
  "Cancelled"
] as const;

export const ProjectZodSchema = z.object({
  name: z.string().min(3, "Project name is required"),
  clientName: z.string().min(2, "Client name is required"),
  clientCompany: z.string().min(2, "Client company is required"),
  description: z.string().min(10, "Description should be detailed"),
  category: z.enum(ProjectCategories),
  priority: z.enum(ProjectPriorities),
  status: z.enum(ProjectStatuses).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
  managerId: z.string().min(10, "Manager must be selected")
});

export type IProjectPayload = z.infer<typeof ProjectZodSchema>;
