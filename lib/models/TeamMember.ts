import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  position: string;
  bio: string;
  image?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const TeamMember: Model<ITeamMember> = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
