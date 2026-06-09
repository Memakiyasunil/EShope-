import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import seedAll from '../services/seedService.js';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    await seedAll();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

run();
