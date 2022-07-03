var mongoose = require('mongoose');
const {config} =  require('../../config');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbForensicsCollection.url);
    console.success("connected to mongodb")
  } catch (error) {
    console.error("Fail to connect to mongoDB", error)
    throw error;
  }
}

module.exports = {connectDB}
