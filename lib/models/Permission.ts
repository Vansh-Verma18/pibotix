import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPermission extends Document {
  action: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema: Schema = new Schema({
  action: { type: String, required: true, unique: true },
  description: { type: String, required: true },
}, { timestamps: true });

export const Permission: Model<IPermission> = mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);
