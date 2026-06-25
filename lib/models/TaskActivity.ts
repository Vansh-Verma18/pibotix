import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITaskActivityDocument extends Document {
  taskId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId; // User who did the action
  action: 'Created' | 'Status Changed' | 'Comment Added' | 'Timer Started' | 'Timer Stopped' | 'Subtask Updated' | 'Other';
  details: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskActivitySchema: Schema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { 
    type: String, 
    enum: ['Created', 'Status Changed', 'Comment Added', 'Timer Started', 'Timer Stopped', 'Subtask Updated', 'Other'],
    required: true 
  },
  details: { type: String, required: true }
}, { timestamps: true });

export const TaskActivity: Model<ITaskActivityDocument> = mongoose.models.TaskActivity || mongoose.model<ITaskActivityDocument>('TaskActivity', TaskActivitySchema);
