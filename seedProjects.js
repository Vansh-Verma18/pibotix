const mongoose = require('mongoose');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const mongoUriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
process.env.MONGODB_URI = mongoUriLine ? mongoUriLine.substring(mongoUriLine.indexOf('=') + 1).trim().replace(/^"|"$/g, '').replace(/(\r\n|\n|\r)/gm, "") : '';

if (!process.env.MONGODB_URI) {
  console.error("No MONGODB_URI found.");
  process.exit(1);
}

// Schemas
const ProjectSchema = new mongoose.Schema({
  projectId: { type: String },
  name: { type: String },
  clientName: { type: String },
  clientCompany: { type: String },
  description: { type: String },
  category: { type: String },
  priority: { type: String },
  status: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  budget: { type: Number },
  progressPercentage: { type: Number },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  assignedEmployees: [{
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    role: { type: String }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const ProjectActivitySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String },
  details: { type: String }
}, { timestamps: true });

const EmployeeSchema = new mongoose.Schema({}, { strict: false });
const UserSchema = new mongoose.Schema({}, { strict: false });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const ProjectActivity = mongoose.models.ProjectActivity || mongoose.model('ProjectActivity', ProjectActivitySchema);
const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const admin = await User.findOne({ role: 'admin' }) || await User.findOne();
    if (!admin) throw new Error("No admin user found.");

    const employees = await Employee.find().limit(5);
    if (employees.length === 0) throw new Error("No employees found. Please add employees first.");

    const managerId = employees[0]._id;
    const teamMembers = employees.slice(1).map(e => ({ employeeId: e._id, role: 'Software Engineer' }));

    const dummyProjects = [
      {
        projectId: 'PRJ-0001',
        name: 'Automate Assembly Line A',
        clientName: 'Sarah Connor',
        clientCompany: 'Cyberdyne Systems',
        description: 'Implement robotic arms and PLC controllers for the main automotive assembly line to increase throughput by 40%.',
        category: 'Robotics',
        priority: 'Critical',
        status: 'In Progress',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        budget: 450000,
        progressPercentage: 35,
        managerId,
        assignedEmployees: teamMembers,
        createdBy: admin._id
      },
      {
        projectId: 'PRJ-0002',
        name: 'Predictive Maintenance IoT Network',
        clientName: 'Elon Musk',
        clientCompany: 'Tesla Gigafactory',
        description: 'Deploy 500 IIoT vibration and temperature sensors across all stamping presses to predict mechanical failures.',
        category: 'IIoT',
        priority: 'High',
        status: 'Planning',
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
        budget: 1200000,
        progressPercentage: 0,
        managerId,
        assignedEmployees: teamMembers.slice(0, 1),
        createdBy: admin._id
      },
      {
        projectId: 'PRJ-0003',
        name: 'AI Defect Detection System',
        clientName: 'Tim Cook',
        clientCompany: 'Apple Inc.',
        description: 'Integrate Machine Vision cameras with Deep Learning models to detect micro-scratches on iPhone chassis.',
        category: 'Machine Vision',
        priority: 'Critical',
        status: 'Testing',
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        budget: 850000,
        progressPercentage: 92,
        managerId,
        assignedEmployees: teamMembers,
        createdBy: admin._id
      },
      {
        projectId: 'PRJ-0004',
        name: 'SCADA System Upgrade',
        clientName: 'Jane Smith',
        clientCompany: 'City Water Dept',
        description: 'Upgrade legacy water treatment SCADA interface to modern web-based dashboards with real-time alerting.',
        category: 'SCADA',
        priority: 'Medium',
        status: 'Completed',
        startDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        budget: 250000,
        progressPercentage: 100,
        managerId,
        assignedEmployees: teamMembers.slice(0, 2),
        createdBy: admin._id
      },
      {
        projectId: 'PRJ-0005',
        name: 'Warehouse Sorting Cobots',
        clientName: 'Jeff Bezos',
        clientCompany: 'Amazon Logistics',
        description: 'Deploy 50 collaborative robots alongside human workers to speed up package sorting during peak seasons.',
        category: 'Robotics',
        priority: 'High',
        status: 'Not Started',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        budget: 3400000,
        progressPercentage: 0,
        managerId,
        assignedEmployees: [],
        createdBy: admin._id
      }
    ];

    await Project.deleteMany({});
    await ProjectActivity.deleteMany({});
    console.log("Cleared existing projects.");

    const insertedProjects = await Project.insertMany(dummyProjects);
    
    const activities = insertedProjects.map(p => ({
      projectId: p._id,
      actorId: admin._id,
      action: 'Created',
      details: 'Initial dummy project seeded by system script.'
    }));

    await ProjectActivity.insertMany(activities);

    console.log("Successfully seeded 5 dummy projects!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
