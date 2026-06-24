import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEmployeeDocument extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  designation: string;
  manager?: string;
  joiningDate: Date;
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Intern';
  salary: number;
  status: 'Active' | 'Inactive' | 'Resigned' | 'Terminated';
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  skills: string[];
  notes?: string;
  userId?: mongoose.Types.ObjectId; // Link to auth User if needed
  createdBy: mongoose.Types.ObjectId; // Admin who created it
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePhoto: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  manager: { type: String },
  joiningDate: { type: Date, required: true },
  employmentType: { 
    type: String, 
    enum: ['Full Time', 'Part Time', 'Contract', 'Intern'],
    required: true
  },
  salary: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Resigned', 'Terminated'],
    default: 'Active'
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, required: true },
  },
  skills: [{ type: String }],
  notes: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Auto-generate employeeId before saving
EmployeeSchema.pre('validate', async function () {
  if (this.isNew && !this.employeeId) {
    const lastEmployee = await mongoose.models.Employee.findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastEmployee && lastEmployee.employeeId) {
      const lastIdNum = parseInt(lastEmployee.employeeId.replace('EMP-', ''));
      this.employeeId = `EMP-${(lastIdNum + 1).toString().padStart(4, '0')}`;
    } else {
      this.employeeId = 'EMP-0001';
    }
  }
});

export const Employee: Model<IEmployeeDocument> = mongoose.models.Employee || mongoose.model<IEmployeeDocument>('Employee', EmployeeSchema);
