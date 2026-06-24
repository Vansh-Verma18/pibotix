const mongoose = require('mongoose');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const mongoUriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
process.env.MONGODB_URI = mongoUriLine ? mongoUriLine.replace('MONGODB_URI=', '').trim().replace(/^"|'/, '').replace(/"|'$/, '') : '';

async function linkFirstUserToFirstEmployee() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find the first user (likely the admin currently logged in)
    const user = await mongoose.connection.collection('users').findOne({});
    if (!user) {
      console.log('No user found in database.');
      process.exit(1);
    }

    // Find the first employee
    const employee = await mongoose.connection.collection('employees').findOne({});
    if (!employee) {
      console.log('No employee found. Please create one in the Employees tab first.');
      process.exit(1);
    }

    // Link them
    await mongoose.connection.collection('employees').updateOne(
      { _id: employee._id },
      { $set: { userId: user._id } }
    );

    console.log(`Successfully linked User (${user.email}) to Employee (${employee.firstName} ${employee.lastName})`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

linkFirstUserToFirstEmployee();
