import mongoose from 'mongoose';

// Load environment variables (usually done in server.js, but good to ensure here)
// Note: In a real project, you would need to install 'dotenv' and call config()
// import dotenv from 'dotenv';
// dotenv.config();

/**
 * Connects to the MongoDB database using the URI from environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;