import { z } from "zod";

export const LeaveTypes = [
  "Annual Leave",
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Work From Home",
  "Unpaid Leave",
  "Compensatory Leave"
] as const;

export const LeaveStatuses = [
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled"
] as const;

export const LeaveRequestZodSchema = z.object({
  leaveType: z.enum(LeaveTypes),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  reason: z.string().min(5, "Reason is required and must be descriptive"),
  attachmentUrl: z.string().optional()
});

export type ILeaveRequestPayload = z.infer<typeof LeaveRequestZodSchema>;

export interface ILeaveBalanceRecord {
  leaveType: string;
  totalAllocated: number;
  usedLeaves: number;
  remainingLeaves: number;
  carryForwardLeaves: number;
}
