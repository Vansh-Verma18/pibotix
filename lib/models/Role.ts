import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, enum: ['superadmin', 'admin', 'user', 'manager', 'employee'], required: true, unique: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
}, { timestamps: true });

export const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);
