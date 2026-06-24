import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILeaveRequestDocument extends Document {
  employeeId: mongoose.Types.ObjectId;
  leaveType: 'Annual Leave' | 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Work From Home' | 'Unpaid Leave' | 'Compensatory Leave';
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  attachmentUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approvedBy?: mongoose.Types.ObjectId;
  approvedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveRequestSchema: Schema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveType: { 
    type: String, 
    enum: ['Annual Leave', 'Casual Leave', 'Sick Leave', 'Earned Leave', 'Work From Home', 'Unpaid Leave', 'Compensatory Leave'],
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  reason: { type: String, required: true },
  attachmentUrl: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedDate: { type: Date }
}, { timestamps: true });

export const LeaveRequest: Model<ILeaveRequestDocument> = mongoose.models.LeaveRequest || mongoose.model<ILeaveRequestDocument>('LeaveRequest', LeaveRequestSchema);
