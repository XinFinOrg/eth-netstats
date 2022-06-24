var mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/forensics');
    console.success("connected to mongodb")
  } catch (error) {
    console.error("Fail to connect to mongoDB", error)
    throw error;
  }
}

module.exports = {connectDB}
