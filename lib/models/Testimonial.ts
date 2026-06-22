import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema({
  clientName: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  image: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
