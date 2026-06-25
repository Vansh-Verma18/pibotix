import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITaskTimeLogDocument extends Document {
  taskId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  durationSeconds: number;
  status: 'Running' | 'Stopped';
  createdAt: Date;
  updatedAt: Date;
}

const TaskTimeLogSchema: Schema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  startTime: { type: Date, required: true, default: Date.now },
  endTime: { type: Date },
  durationSeconds: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Running', 'Stopped'],
    default: 'Running'
  }
}, { timestamps: true });

export const TaskTimeLog: Model<ITaskTimeLogDocument> = mongoose.models.TaskTimeLog || mongoose.model<ITaskTimeLogDocument>('TaskTimeLog', TaskTimeLogSchema);
