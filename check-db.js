const mongoose = require('mongoose');
const fs = require('fs');

async function checkDb() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  let mongoUri = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('MONGODB_URI=')) {
      mongoUri = line.split('=')[1].trim();
      // Remove quotes if present
      if (mongoUri.startsWith('"') || mongoUri.startsWith("'")) {
        mongoUri = mongoUri.substring(1, mongoUri.length - 1);
      }
    }
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to DB');
  const User = mongoose.connection.collection('users');
  const user = await User.findOne({ email: 'vansh12@gmail.com' });
  console.log('User found:', user);
  process.exit(0);
}

checkDb();
