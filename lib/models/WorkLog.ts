import mongoose, { Document, Schema, Model } from "mongoose";

export interface IWorkLog extends Document {
  logId: string;
  employeeId: mongoose.Types.ObjectId;
  employeeName: string;
  date: Date;

  projectId?: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  
  // Dependencies
  clientName?: string;
  machine?: string;
  department?: string;

  startTime: string;
  endTime: string;
  totalHoursWorked: number;

  workSummary: string;
  challengesFaced?: string;
  blockers?: string;
  
  // Tomorrow's plan
  tasksPlanned?: string;
  estimatedHours?: number;
  priority?: "Low" | "Medium" | "High" | "Critical";

  tasksCompleted: number;
  currentProgress: number;

  managerNotes?: string;
  attachments?: string[];

  status: "Draft" | "Submitted" | "Reviewed" | "Approved" | "Request Changes";

  createdAt: Date;
  updatedAt: Date;
}

const workLogSchema = new Schema<IWorkLog>(
  {
    logId: { type: String, unique: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    employeeName: { type: String, required: true },
    date: { type: Date, required: true },

    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },

    clientName: { type: String },
    machine: { type: String },
    department: { type: String },

    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    totalHoursWorked: { type: Number, required: true },

    workSummary: { type: String, required: true },
    challengesFaced: { type: String },
    blockers: { type: String },

    tasksPlanned: { type: String },
    estimatedHours: { type: Number },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"] },

    tasksCompleted: { type: Number, default: 0 },
    currentProgress: { type: Number, default: 0, min: 0, max: 100 },

    managerNotes: { type: String },
    attachments: [{ type: String }],

    status: {
      type: String,
      enum: ["Draft", "Submitted", "Reviewed", "Approved", "Request Changes"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

workLogSchema.pre("validate", async function (next) {
  if (this.isNew && !this.logId) {
    const Model = mongoose.models.WorkLog || mongoose.model("WorkLog", workLogSchema);
    const lastLog = await Model.findOne({}, {}, { sort: { createdAt: -1 } });
    if (lastLog && lastLog.logId) {
      const lastIdNum = parseInt(lastLog.logId.replace("WL-", ""), 10);
      this.logId = `WL-${String(lastIdNum + 1).padStart(4, "0")}`;
    } else {
      this.logId = "WL-0001";
    }
  }
  next();
});

export const WorkLog: Model<IWorkLog> =
  mongoose.models.WorkLog || mongoose.model<IWorkLog>("WorkLog", workLogSchema);
