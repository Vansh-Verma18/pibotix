import { z } from 'zod';

export const EmployeeZodSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  profilePhoto: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  department: z.string().min(2, "Department is required"),
  designation: z.string().min(2, "Designation is required"),
  manager: z.string().optional(), // Could be an ObjectId string or Name
  joiningDate: z.string().or(z.date()),
  employmentType: z.enum(['Full Time', 'Part Time', 'Contract', 'Intern']),
  salary: z.number().min(0, "Salary must be a positive number"),
  status: z.enum(['Active', 'Inactive', 'Resigned', 'Terminated']),
  emergencyContact: z.object({
    name: z.string().min(2, "Emergency contact name is required"),
    phone: z.string().min(10, "Emergency contact phone is required"),
    relation: z.string().min(2, "Relation is required"),
  }),
  skills: z.array(z.string()).default([]),
  notes: z.string().optional(),
  userId: z.string().optional(), // Reference to User model if linked
});

export type IEmployeeForm = z.infer<typeof EmployeeZodSchema>;

export interface IEmployee extends IEmployeeForm {
  _id: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
