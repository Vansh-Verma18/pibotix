import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProjectDocument extends Document {
  projectId: string;
  name: string;
  clientName: string;
  clientCompany: string;
  description: string;
  category: 'Industrial Automation' | 'Robotics' | 'PLC Programming' | 'SCADA' | 'Machine Vision' | 'AI Inspection' | 'IIoT' | 'Predictive Maintenance';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Planning' | 'Not Started' | 'In Progress' | 'Testing' | 'Review' | 'Completed' | 'On Hold' | 'Cancelled';
  startDate: Date;
  endDate: Date;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  budget: number;
  estimatedCost?: number;
  actualCost?: number;
  progressPercentage: number;
  managerId: mongoose.Types.ObjectId; // Ref to Employee
  assignedEmployees: {
    employeeId: mongoose.Types.ObjectId;
    role: string; // e.g. Lead Engineer, Automation Engineer
  }[];
  documents: string[];
  images: string[];
  createdBy: mongoose.Types.ObjectId; // Admin User
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  projectId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  clientName: { type: String, required: true },
  clientCompany: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Industrial Automation', 'Robotics', 'PLC Programming', 'SCADA', 'Machine Vision', 'AI Inspection', 'IIoT', 'Predictive Maintenance'],
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Planning', 'Not Started', 'In Progress', 'Testing', 'Review', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Planning'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  estimatedCompletion: { type: Date },
  actualCompletion: { type: Date },
  budget: { type: Number, required: true },
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  progressPercentage: { type: Number, default: 0 },
  managerId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  assignedEmployees: [{
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    role: { type: String }
  }],
  documents: [{ type: String }],
  images: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Auto-generate projectId before saving
ProjectSchema.pre('validate', async function () {
  if (this.isNew && !this.projectId) {
    const lastProject = await mongoose.models.Project.findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastProject && lastProject.projectId) {
      const lastIdNum = parseInt(lastProject.projectId.replace('PRJ-', ''));
      this.projectId = `PRJ-${(lastIdNum + 1).toString().padStart(4, '0')}`;
    } else {
      this.projectId = 'PRJ-0001';
    }
  }
});

export const Project: Model<IProjectDocument> = mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);
