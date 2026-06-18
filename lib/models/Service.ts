import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  benefits: string[];
  features: string[];
  technologiesUsed: string[];
  workflowSteps: { title: string; description: string }[];
  industriesServed: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  icon: { type: String, required: true, default: 'settings' },
  benefits: [{ type: String }],
  features: [{ type: String }],
  technologiesUsed: [{ type: String }],
  workflowSteps: [
    {
      title: { type: String },
      description: { type: String }
    }
  ],
  industriesServed: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
