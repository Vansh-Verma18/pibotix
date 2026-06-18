import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  company: string;
  phone?: string;
  serviceOfInterest?: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String },
  serviceOfInterest: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'closed'], default: 'new' },
}, { timestamps: true });

export const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
