import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAsset extends Document {
  assetId: string;
  name: string;
  category: string;
  subCategory?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  qrCode?: string;
  barcode?: string;
  
  purchaseDate?: Date;
  purchaseCost?: number;
  warrantyExpiry?: Date;
  supplier?: string;
  
  currentLocation?: string;
  department?: string;
  
  assignedEmployee?: mongoose.Types.ObjectId;
  assignedProject?: mongoose.Types.ObjectId;
  
  status: "Available" | "Assigned" | "In Maintenance" | "Damaged" | "Retired" | "Lost" | "Replacement Required";
  condition: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
  
  purchaseInvoice?: string;
  assetImages?: string[];
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>(
  {
    assetId: { type: String, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    manufacturer: { type: String },
    modelNumber: { type: String },
    serialNumber: { type: String },
    qrCode: { type: String },
    barcode: { type: String },

    purchaseDate: { type: Date },
    purchaseCost: { type: Number },
    warrantyExpiry: { type: Date },
    supplier: { type: String },

    currentLocation: { type: String },
    department: { type: String },

    assignedEmployee: { type: Schema.Types.ObjectId, ref: "Employee" },
    assignedProject: { type: Schema.Types.ObjectId, ref: "Project" },

    status: {
      type: String,
      enum: ["Available", "Assigned", "In Maintenance", "Damaged", "Retired", "Lost", "Replacement Required"],
      default: "Available",
    },
    condition: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor", "Critical"],
      default: "Excellent",
    },

    purchaseInvoice: { type: String },
    assetImages: [{ type: String }],
    notes: { type: String },
  },
  { timestamps: true }
);

assetSchema.pre("validate", async function () {
  if (this.isNew && !this.assetId) {
    const AssetModel = (mongoose.models.Asset as Model<IAsset>) || mongoose.model<IAsset>("Asset", assetSchema);
    const lastAsset = await AssetModel.findOne({}, {}, { sort: { createdAt: -1 } });
    if (lastAsset && lastAsset.assetId && lastAsset.assetId.startsWith("AST-")) {
      const lastIdNum = parseInt(lastAsset.assetId.replace("AST-", ""), 10);
      this.assetId = `AST-${String(lastIdNum + 1).padStart(5, "0")}`;
    } else {
      this.assetId = "AST-00001";
    }
    
    if (!this.qrCode) {
      this.qrCode = this.assetId; // Fallback to asset ID for QR content
    }
  }
});

export const Asset: Model<IAsset> = (mongoose.models.Asset as Model<IAsset>) || mongoose.model<IAsset>("Asset", assetSchema);
