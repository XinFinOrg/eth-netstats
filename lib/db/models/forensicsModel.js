var mongoose = require('mongoose');
const { Schema } = mongoose;

const forensicsSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  DivergingHash: String,
  DivergingBlockNumber: Number,
  AcrossEpochs: Boolean,
  SmallerRoundInfo: {
    HashPath: [String],
    QuorumCert: {
      ProposedBlockInfo: {
        Hash: String,
        Round: Number,
        Number: Number
      },
      Signatures: [String],
      GapNumber: Number
    },
    SignerAddresses: [String]
  },
  LargerRoundInfo: {
    HashPath: [String],
    QuorumCert: {
      ProposedBlockInfo: {
        Hash: String,
        Round: Number,
        Number: Number
      },
      Signatures: [String],
      GapNumber: Number
    },
    SignerAddresses: [String]
  }
});


module.exports = mongoose.model('Forensics', forensicsSchema)