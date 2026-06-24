import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IConsultation extends Document {
  name: string;
  email: string;
  company: string;
  phone?: string;
  service: string;
  industry: string;
  budget: string;
  documentUrl?: string;
  preferredDate: string;
  timeSlot: string;
  topic: string;
  message: string;
  status: 'pending' | 'approved' | 'scheduled' | 'completed' | 'cancelled' | 'rejected' | 'rescheduled';
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String },
  service: { type: String, required: true },
  industry: { type: String, required: true },
  budget: { type: String, required: true },
  documentUrl: { type: String },
  preferredDate: { type: String, required: true },
  timeSlot: { type: String, required: true },
  topic: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'scheduled', 'completed', 'cancelled', 'rejected', 'rescheduled'], 
    default: 'pending' 
  },
}, { timestamps: true });

export const Consultation: Model<IConsultation> = mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);
