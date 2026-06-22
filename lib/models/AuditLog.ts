import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  performedBy?: mongoose.Types.ObjectId;
  targetUser?: mongoose.Types.ObjectId;
  details?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  targetUser: { type: Schema.Types.ObjectId, ref: 'User' },
  details: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
