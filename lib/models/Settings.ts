import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  contactEmail: string;
  supportPhone: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
  siteName: { type: String, default: 'Pibotix CMS' },
  contactEmail: { type: String, default: 'contact@example.com' },
  supportPhone: { type: String, default: '+1 (555) 000-0000' },
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
  },
  seo: {
    metaTitle: { type: String, default: 'Pibotix - Advanced Robotics Solutions' },
    metaDescription: { type: String, default: 'Leading provider of automated robotics systems for manufacturing.' },
  },
}, { timestamps: true });

export const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
