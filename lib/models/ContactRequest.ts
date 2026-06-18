import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IContactRequest extends Document {
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

const ContactRequestSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
}, { timestamps: true });

export const ContactRequest: Model<IContactRequest> = mongoose.models.ContactRequest || mongoose.model<IContactRequest>('ContactRequest', ContactRequestSchema);
