import mongoose from 'mongoose';
// TODO flytta fil
const connectDb = async () => {
  const mongoURI: string = process.env.MONGO_URI || '';
  try {
    const conn = await mongoose.connect(mongoURI);
    // console.log(`MongoDB is connected to ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
  }
};

export default connectDb;
