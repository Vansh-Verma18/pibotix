import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IConsultation extends Document {
  name: string;
  email: string;
  company: string;
  phone?: string;
  preferredDate: string;
  timeSlot: string;
  topic: string;
  message: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  phone: { type: String },
  preferredDate: { type: String, required: true },
  timeSlot: { type: String, required: true },
  topic: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'scheduled', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export const Consultation: Model<IConsultation> = mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);
