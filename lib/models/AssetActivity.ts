import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAssetActivity extends Document {
  assetId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId; // Admin or Manager ID who performed the action
  targetEmployeeId?: mongoose.Types.ObjectId; // Employee it was assigned to (if applicable)
  targetProjectId?: mongoose.Types.ObjectId;
  
  action: "Purchased" | "Assigned" | "Returned" | "Transferred" | "Maintenance Started" | "Maintenance Completed" | "Damaged" | "Retired" | "Other";
  details?: string;
  cost?: number;
  
  date: Date;
  createdAt: Date;
}

const assetActivitySchema = new Schema<IAssetActivity>(
  {
    assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    actorId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    targetEmployeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
    targetProjectId: { type: Schema.Types.ObjectId, ref: "Project" },

    action: {
      type: String,
      enum: ["Purchased", "Assigned", "Returned", "Transferred", "Maintenance Started", "Maintenance Completed", "Damaged", "Retired", "Other"],
      required: true
    },
    details: { type: String },
    cost: { type: Number },
    date: { type: Date, default: Date.now }
  },
  { timestamps: { updatedAt: false } }
);

export const AssetActivity: Model<IAssetActivity> = mongoose.models.AssetActivity || mongoose.model<IAssetActivity>("AssetActivity", assetActivitySchema);
