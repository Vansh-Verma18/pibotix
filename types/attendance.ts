import { z } from 'zod';

export const AttendanceStatusEnum = z.enum([
  'Present',
  'Absent',
  'Half Day',
  'Leave',
  'Work From Home',
  'Holiday'
]);

export const AttendanceZodSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  date: z.string().or(z.date()),
  checkInTime: z.string().optional().nullable(),
  checkOutTime: z.string().optional().nullable(),
  workingHours: z.number().default(0),
  breakDuration: z.number().default(0),
  overtimeHours: z.number().default(0),
  status: AttendanceStatusEnum.default('Absent'),
  notes: z.string().optional(),
});

export type IAttendanceForm = z.infer<typeof AttendanceZodSchema>;

export interface IAttendance extends IAttendanceForm {
  _id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  employeeName?: string; // Virtual or populated
  employeeDepartment?: string;
}
