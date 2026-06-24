import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILeaveBalanceDocument extends Document {
  employeeId: mongoose.Types.ObjectId;
  year: number;
  balances: {
    leaveType: 'Annual Leave' | 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Work From Home' | 'Unpaid Leave' | 'Compensatory Leave';
    totalAllocated: number;
    usedLeaves: number;
    remainingLeaves: number;
    carryForwardLeaves: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LeaveBalanceSchema: Schema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  year: { type: Number, required: true },
  balances: [{
    leaveType: { type: String, required: true },
    totalAllocated: { type: Number, default: 0 },
    usedLeaves: { type: Number, default: 0 },
    remainingLeaves: { type: Number, default: 0 },
    carryForwardLeaves: { type: Number, default: 0 },
  }]
}, { timestamps: true });

// Ensure unique balance sheet per employee per year
LeaveBalanceSchema.index({ employeeId: 1, year: 1 }, { unique: true });

export const LeaveBalance: Model<ILeaveBalanceDocument> = mongoose.models.LeaveBalance || mongoose.model<ILeaveBalanceDocument>('LeaveBalance', LeaveBalanceSchema);
