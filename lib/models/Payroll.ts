import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPayrollDocument extends Document {
  payrollId: string;
  employeeId: mongoose.Types.ObjectId;
  
  salaryMonth: number; // 1-12
  salaryYear: number;
  
  // Earnings
  basicSalary: number;
  hra: number; // House Rent Allowance
  medicalAllowance: number;
  travelAllowance: number;
  specialAllowance: number;
  
  // Variable / Dynamic Earnings
  overtimePay: number;
  performanceBonus: number;
  projectBonus: number;
  incentives: number;
  
  grossSalary: number; // Sum of all Earnings
  
  // Deductions
  tax: number;
  providentFund: number;
  insurance: number;
  latePenalty: number;
  leaveDeduction: number;
  otherDeductions: number;
  
  totalDeductions: number; // Sum of all Deductions
  
  netSalary: number; // Gross - Total Deductions
  
  // Financial Metdata
  paymentStatus: 'Pending' | 'Processing' | 'Paid' | 'Failed';
  paymentMethod: 'Bank Transfer' | 'UPI' | 'Cash' | 'Cheque';
  transactionId?: string;
  salarySlipPdf?: string;
  remarks?: string;
  
  // Bank Information (Snapshot at the time of processing)
  bankDetails?: {
    bankName: string;
    accountNumber: string; // Stored encrypted or masked
    ifsc: string;
    upiId?: string;
    accountHolderName: string;
  };

  createdBy: mongoose.Types.ObjectId;
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema: Schema = new Schema({
  payrollId: { type: String, required: true, unique: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  
  salaryMonth: { type: Number, required: true, min: 1, max: 12 },
  salaryYear: { type: Number, required: true },
  
  // Earnings
  basicSalary: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  medicalAllowance: { type: Number, default: 0 },
  travelAllowance: { type: Number, default: 0 },
  specialAllowance: { type: Number, default: 0 },
  
  overtimePay: { type: Number, default: 0 },
  performanceBonus: { type: Number, default: 0 },
  projectBonus: { type: Number, default: 0 },
  incentives: { type: Number, default: 0 },
  
  grossSalary: { type: Number, required: true },
  
  // Deductions
  tax: { type: Number, default: 0 },
  providentFund: { type: Number, default: 0 },
  insurance: { type: Number, default: 0 },
  latePenalty: { type: Number, default: 0 },
  leaveDeduction: { type: Number, default: 0 },
  otherDeductions: { type: Number, default: 0 },
  
  totalDeductions: { type: Number, required: true },
  
  netSalary: { type: Number, required: true },
  
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Paid', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'UPI', 'Cash', 'Cheque'],
    default: 'Bank Transfer'
  },
  transactionId: { type: String },
  salarySlipPdf: { type: String },
  remarks: { type: String },
  
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },
    upiId: { type: String },
    accountHolderName: { type: String }
  },

  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  processedAt: { type: Date }
}, { timestamps: true });

// Prevent multiple payrolls for the same employee in the same month
PayrollSchema.index({ employeeId: 1, salaryMonth: 1, salaryYear: 1 }, { unique: true });

PayrollSchema.pre('validate', async function () {
  if (this.isNew && !this.payrollId) {
    const Model = mongoose.models.Payroll || mongoose.model("Payroll", PayrollSchema);
    const lastPayroll = await Model.findOne({}, {}, { sort: { createdAt: -1 } });
    if (lastPayroll && lastPayroll.payrollId) {
      // PR-202310-001
      const parts = lastPayroll.payrollId.split('-');
      if (parts.length === 3) {
        const sequence = parseInt(parts[2], 10);
        this.payrollId = `PR-${this.salaryYear}${String(this.salaryMonth).padStart(2, '0')}-${String(sequence + 1).padStart(4, '0')}`;
      } else {
        this.payrollId = `PR-${this.salaryYear}${String(this.salaryMonth).padStart(2, '0')}-0001`;
      }
    } else {
      this.payrollId = `PR-${this.salaryYear}${String(this.salaryMonth).padStart(2, '0')}-0001`;
    }
  }
});

export const Payroll: Model<IPayrollDocument> = (mongoose.models.Payroll as Model<IPayrollDocument>) || mongoose.model<IPayrollDocument>('Payroll', PayrollSchema);
