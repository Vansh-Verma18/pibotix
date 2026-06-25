import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITaskDocument extends Document {
  taskId: string;
  name: string;
  description: string;
  projectId: mongoose.Types.ObjectId; // Ref to Project
  assignedEmployee: mongoose.Types.ObjectId; // Ref to Employee
  assignedBy: mongoose.Types.ObjectId; // Ref to User (Admin/Manager)
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Backlog' | 'To Do' | 'In Progress' | 'Testing' | 'Under Review' | 'Blocked' | 'Completed';
  estimatedHours: number;
  actualHours: number;
  startDate: Date;
  dueDate: Date;
  completionDate?: Date;
  completionPercentage: number;
  dependencies: mongoose.Types.ObjectId[]; // Ref to other Tasks
  tags: string[];
  attachments: string[];
  comments: {
    userId: mongoose.Types.ObjectId; // Ref to User
    text: string;
    createdAt: Date;
  }[];
  subtasks: {
    title: string;
    isCompleted: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  taskId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedEmployee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Backlog', 'To Do', 'In Progress', 'Testing', 'Under Review', 'Blocked', 'Completed'],
    default: 'Backlog'
  },
  estimatedHours: { type: Number, default: 0 },
  actualHours: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  completionDate: { type: Date },
  completionPercentage: { type: Number, default: 0 },
  dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  tags: [{ type: String }],
  attachments: [{ type: String }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  subtasks: [{
    title: { type: String },
    isCompleted: { type: Boolean, default: false }
  }]
}, { timestamps: true });

// Auto-generate taskId before saving
TaskSchema.pre('validate', async function () {
  if (this.isNew && !this.taskId) {
    const lastTask = await mongoose.models.Task.findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastTask && lastTask.taskId) {
      const lastIdNum = parseInt(lastTask.taskId.replace('TSK-', ''));
      this.taskId = `TSK-${(lastIdNum + 1).toString().padStart(4, '0')}`;
    } else {
      this.taskId = 'TSK-0001';
    }
  }
});

export const Task: Model<ITaskDocument> = mongoose.models.Task || mongoose.model<ITaskDocument>('Task', TaskSchema);
