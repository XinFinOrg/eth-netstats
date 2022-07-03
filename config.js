const config = {
  port: process.env.PORT || 2000,
  wsSecret: process.env.WS_SECRET || 'xinfin_xdpos_hybrid_network_stats',
  logger: {
    verbosity: process.env.VERBOSITY || 1
  },
  mongodbForensicsCollection: {
    url: `mongodb://${process.env.MONGODBURL || 'localhost:27017'}/forensics`
  }
};

module.exports = {config}