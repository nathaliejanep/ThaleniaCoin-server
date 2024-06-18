import mongoose from 'mongoose';
// TODO flytta fil
const connectDb = async () => {
  const mongoURI: string = process.env.MONGO_URI || '';
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
  }
};

export default connectDb;
