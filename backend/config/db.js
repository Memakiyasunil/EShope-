import dns from 'dns';
import mongoose from 'mongoose';

// Avoid mongodb+srv on Windows when system DNS refuses SRV (querySrv ECONNREFUSED).
dns.setDefaultResultOrder('ipv4first');

const getMongoUri = () => {
  if (process.env.MONGO_URI_STANDARD) {
    return process.env.MONGO_URI_STANDARD;
  }
  const uri = process.env.MONGO_URI || '';
  if (uri.startsWith('mongodb+srv://')) {
    console.warn(
      'Warning: mongodb+srv:// may fail on some networks (querySrv ECONNREFUSED).',
      'Set MONGO_URI_STANDARD in .env with the standard connection string from MongoDB Atlas.'
    );
  }
  return uri;
};

const connectDB = async () => {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error('MONGO_URI or MONGO_URI_STANDARD is not set in .env');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    if (uri.startsWith('mongodb+srv://')) {
      console.error(
        'Tip: In Atlas → Connect → Drivers, copy the "standard connection string" (mongodb://...)',
        'and set it as MONGO_URI_STANDARD in backend/.env'
      );
    }
    throw error;
  }
};

export default connectDB;
