import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  clientIndustry: string;
  challenge: string;
  solution: string;
  results: string[];
  roiMetrics: { label: string; value: string }[];
  technologiesUsed: string[];
  coverImage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudySchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  clientIndustry: { type: String, required: true },
  challenge: { type: String, required: true },
  solution: { type: String, required: true },
  results: [{ type: String }],
  roiMetrics: [
    {
      label: { type: String },
      value: { type: String }
    }
  ],
  technologiesUsed: [{ type: String }],
  coverImage: { type: String, default: '/placeholder-case-study.jpg' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const CaseStudy: Model<ICaseStudy> = mongoose.models.CaseStudy || mongoose.model<ICaseStudy>('CaseStudy', CaseStudySchema);
