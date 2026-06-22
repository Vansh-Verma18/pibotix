import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISiteAnalytics extends Document {
  date: Date;
  visitors: number;
  pageViews: number;
  sources: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
  };
  averageSessionDuration: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

const SiteAnalyticsSchema: Schema = new Schema({
  date: { type: Date, required: true, unique: true },
  visitors: { type: Number, default: 0 },
  pageViews: { type: Number, default: 0 },
  sources: {
    organic: { type: Number, default: 0 },
    direct: { type: Number, default: 0 },
    referral: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
  },
  averageSessionDuration: { type: Number, default: 0 },
}, { timestamps: true });

export const SiteAnalytics: Model<ISiteAnalytics> = mongoose.models.SiteAnalytics || mongoose.model<ISiteAnalytics>('SiteAnalytics', SiteAnalyticsSchema);
