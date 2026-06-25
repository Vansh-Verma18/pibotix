import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProjectActivityDocument extends Document {
  projectId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId; // User who did the action
  action: 'Created' | 'Status Changed' | 'Employee Assigned' | 'Document Uploaded' | 'Budget Updated' | 'Progress Updated' | 'Other';
  details: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectActivitySchema: Schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { 
    type: String, 
    enum: ['Created', 'Status Changed', 'Employee Assigned', 'Document Uploaded', 'Budget Updated', 'Progress Updated', 'Other'],
    required: true 
  },
  details: { type: String, required: true }
}, { timestamps: true });

export const ProjectActivity: Model<IProjectActivityDocument> = mongoose.models.ProjectActivity || mongoose.model<IProjectActivityDocument>('ProjectActivity', ProjectActivitySchema);
