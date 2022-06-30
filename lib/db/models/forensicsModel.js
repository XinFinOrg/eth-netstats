var mongoose = require('mongoose');
const { Schema } = mongoose;

const forensicsSchema = new Schema({
  forensicsType: String,
  eventTime: { type: Date, default: Date.now },
  content: String
});


module.exports = mongoose.model('Forensics', forensicsSchema)