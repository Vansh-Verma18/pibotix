import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAttendanceDocument extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date; // Stored at 00:00:00 UTC for grouping
  checkInTime?: Date;
  checkOutTime?: Date;
  workingHours: number;
  breakDuration: number;
  overtimeHours: number;
  status: 'Present' | 'Absent' | 'Half Day' | 'Leave' | 'Work From Home' | 'Holiday';
  notes?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  workingHours: { type: Number, default: 0 },
  breakDuration: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half Day', 'Leave', 'Work From Home', 'Holiday'],
    default: 'Absent'
  },
  notes: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Ensure an employee can only have one attendance record per day
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const Attendance: Model<IAttendanceDocument> = mongoose.models.Attendance || mongoose.model<IAttendanceDocument>('Attendance', AttendanceSchema);
