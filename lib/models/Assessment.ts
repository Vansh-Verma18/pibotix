import mongoose from 'mongoose';

export interface IAssessment {
  name: string;
  email: string;
  companyName: string;
  companySize: string;
  employeeCount: string;
  productionCapacity: string;
  currentProcesses: string;
  manualWorkPercentage: number;
  existingSoftware: string;
  automationBudget: string;
  automationScore: number;
  digitalTransformationScore: number;
  suggestedTechnologies: string[];
  expectedROI: string;
  estimatedCostSavings: string;
  recommendedServices: string[];
  status: 'New' | 'Contacted';
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new mongoose.Schema<IAssessment>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String, required: true },
    companySize: { type: String, required: true },
    employeeCount: { type: String, required: true },
    productionCapacity: { type: String, required: true },
    currentProcesses: { type: String, required: true },
    manualWorkPercentage: { type: Number, required: true },
    existingSoftware: { type: String, required: true },
    automationBudget: { type: String, required: true },
    automationScore: { type: Number, required: true },
    digitalTransformationScore: { type: Number, required: true },
    suggestedTechnologies: [{ type: String }],
    expectedROI: { type: String, required: true },
    estimatedCostSavings: { type: String, required: true },
    recommendedServices: [{ type: String }],
    status: { type: String, enum: ['New', 'Contacted'], default: 'New' },
  },
  { timestamps: true }
);

export const Assessment = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
