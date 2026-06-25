import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMaintenanceRecord extends Document {
  assetId: mongoose.Types.ObjectId;
  maintenanceType: "Preventive" | "Repair" | "Calibration" | "Inspection" | "Upgrade";
  serviceDate: Date;
  technician?: string;
  cost?: number;
  notes?: string;
  nextMaintenanceDate?: Date;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceRecordSchema = new Schema<IMaintenanceRecord>(
  {
    assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    maintenanceType: {
      type: String,
      enum: ["Preventive", "Repair", "Calibration", "Inspection", "Upgrade"],
      required: true
    },
    serviceDate: { type: Date, required: true },
    technician: { type: String },
    cost: { type: Number },
    notes: { type: String },
    nextMaintenanceDate: { type: Date },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Scheduled"
    }
  },
  { timestamps: true }
);

export const MaintenanceRecord: Model<IMaintenanceRecord> = mongoose.models.MaintenanceRecord || mongoose.model<IMaintenanceRecord>("MaintenanceRecord", maintenanceRecordSchema);
