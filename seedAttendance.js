const mongoose = require('mongoose');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const mongoUriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
process.env.MONGODB_URI = mongoUriLine ? mongoUriLine.replace('MONGODB_URI=', '').trim().replace(/^"|'/, '').replace(/"|'$/, '') : '';

async function seedAttendance() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection;
    
    // Check if we have employees
    let employees = await db.collection('employees').find({}).toArray();
    
    // If less than 5 employees, let's create a few dummy ones
    if (employees.length < 5) {
      console.log('Creating dummy employees...');
      const dummyEmployees = [
        {
          employeeId: 'EMP-0002', firstName: 'Alice', lastName: 'Johnson', email: 'alice.j@example.com',
          phone: '1234567891', address: 'New York, NY', department: 'Engineering', designation: 'Frontend Developer',
          joiningDate: new Date('2023-01-15'), employmentType: 'Full Time', salary: 85000, status: 'Active',
          emergencyContact: { name: 'Bob Johnson', phone: '1234567890', relation: 'Spouse' },
          skills: ['React', 'TypeScript'], createdAt: new Date(), updatedAt: new Date(),
          createdBy: employees[0]?._id || new mongoose.Types.ObjectId()
        },
        {
          employeeId: 'EMP-0003', firstName: 'Michael', lastName: 'Smith', email: 'michael.s@example.com',
          phone: '1234567892', address: 'Austin, TX', department: 'Sales', designation: 'Account Executive',
          joiningDate: new Date('2023-03-10'), employmentType: 'Full Time', salary: 75000, status: 'Active',
          emergencyContact: { name: 'Sarah Smith', phone: '1234567890', relation: 'Spouse' },
          skills: ['Salesforce', 'Negotiation'], createdAt: new Date(), updatedAt: new Date(),
          createdBy: employees[0]?._id || new mongoose.Types.ObjectId()
        },
        {
          employeeId: 'EMP-0004', firstName: 'Emma', lastName: 'Davis', email: 'emma.d@example.com',
          phone: '1234567893', address: 'Seattle, WA', department: 'HR', designation: 'HR Manager',
          joiningDate: new Date('2022-11-01'), employmentType: 'Full Time', salary: 90000, status: 'Active',
          emergencyContact: { name: 'John Davis', phone: '1234567890', relation: 'Sibling' },
          skills: ['Recruitment', 'Conflict Resolution'], createdAt: new Date(), updatedAt: new Date(),
          createdBy: employees[0]?._id || new mongoose.Types.ObjectId()
        },
        {
          employeeId: 'EMP-0005', firstName: 'James', lastName: 'Wilson', email: 'james.w@example.com',
          phone: '1234567894', address: 'Chicago, IL', department: 'Engineering', designation: 'Backend Engineer',
          joiningDate: new Date('2024-02-20'), employmentType: 'Full Time', salary: 95000, status: 'Active',
          emergencyContact: { name: 'Mary Wilson', phone: '1234567890', relation: 'Parent' },
          skills: ['Node.js', 'MongoDB'], createdAt: new Date(), updatedAt: new Date(),
          createdBy: employees[0]?._id || new mongoose.Types.ObjectId()
        }
      ];
      
      for (const emp of dummyEmployees) {
        const existing = await db.collection('employees').findOne({ email: emp.email });
        if (!existing) {
          await db.collection('employees').insertOne(emp);
        }
      }
      employees = await db.collection('employees').find({}).toArray();
    }

    console.log(`Found ${employees.length} employees. Generating attendance data...`);

    // Generate Attendance for the last 10 days for each employee
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    
    let attendanceCount = 0;

    for (let i = 0; i < 10; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() - i);
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      for (const emp of employees) {
        // Skip existing attendance
        const existing = await db.collection('attendances').findOne({ employeeId: emp._id, date: currentDate });
        if (existing) continue;

        // Randomize attendance
        const rand = Math.random();
        let status = 'Present';
        let workingHours = 0;
        let overtimeHours = 0;
        let checkInTime = null;
        let checkOutTime = null;

        if (rand < 0.1) {
          status = 'Absent';
        } else if (rand < 0.2) {
          status = 'Leave';
        } else if (rand < 0.3) {
          status = 'Work From Home';
          workingHours = 9.5;
          overtimeHours = 0.5;
          checkInTime = new Date(currentDate); checkInTime.setUTCHours(9, 0, 0, 0);
          checkOutTime = new Date(currentDate); checkOutTime.setUTCHours(18, 30, 0, 0);
        } else if (rand < 0.4) {
          status = 'Half Day';
          workingHours = 4.5;
          overtimeHours = 0;
          checkInTime = new Date(currentDate); checkInTime.setUTCHours(9, 0, 0, 0);
          checkOutTime = new Date(currentDate); checkOutTime.setUTCHours(13, 30, 0, 0);
        } else {
          status = 'Present';
          // Random hours between 8.5 and 10
          workingHours = Number((8.5 + Math.random() * 1.5).toFixed(2));
          overtimeHours = workingHours > 9 ? Number((workingHours - 9).toFixed(2)) : 0;
          
          checkInTime = new Date(currentDate); checkInTime.setUTCHours(9, Math.floor(Math.random() * 30), 0, 0);
          checkOutTime = new Date(checkInTime);
          checkOutTime.setUTCMilliseconds(checkOutTime.getUTCMilliseconds() + (workingHours * 60 * 60 * 1000));
        }

        const record = {
          employeeId: emp._id,
          date: currentDate,
          checkInTime,
          checkOutTime,
          workingHours,
          overtimeHours,
          breakDuration: status === 'Absent' || status === 'Leave' ? 0 : 1,
          status,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection('attendances').insertOne(record);
        attendanceCount++;
      }
    }

    console.log(`Successfully seeded ${attendanceCount} attendance records!`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedAttendance();
