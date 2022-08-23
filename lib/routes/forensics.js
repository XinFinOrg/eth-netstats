
const { getCollection } = require("../collection");
const { saveForensicsReport, bulkGetEventsSummary, bulkGetLatestSummary, findDetailedForensicsById} = require("../service/storage");
const {getMasterNodeInfo} = require('../client/masternode');

// Return the last X number of forensics events in timestamp order by X number of days
const getForensicsReports = async (req, res) => {
  const { range } = req.query;
  if (range === 'all') {
    // Load all reports if query parameters not specified
    reports = await bulkGetEventsSummary();
  } else {
    // By default, we load the last 7 days of events
    const rangeInDays = parseInt(range) || 7;
    const now = new Date();
    reports = await bulkGetEventsSummary(new Date(now.setDate(now.getDate() - rangeInDays)).toISOString());
  }
  
  res.status(200).json(reports);
};

// Return the detailed forensics report using the id from query
const getDetailedForensicsReport = async (req, res) => {
  const detailedReport = await findDetailedForensicsById(req.query.id)
  res.status(200).json(detailedReport);
};

// Check latest id. if the incoming id is older, then return whatever is newer
const getLatestForensicsReport = async (req, res) => {
  const {id} = req.query;
  const newForensicsReports = [];
  // Load the latest block
  const bestBlock = getCollection().getBestBlock();
  const latestBlockInfo = {
    blockNumber: bestBlock?.block?.number?.toString() || '0',
    blockHash: bestBlock?.block?.hash || ''
  }
  // Load latest committed block
  const highestCommittedBlockInfo = getCollection().getHighestCommittedBlockInfo();
  
  if (id) {
    // This is a special case where 0 forensics has ever happened. To save some DB operations, we skip the realtime polling
    const summaries = await bulkGetLatestSummary();
    if(summaries.length) {
      const itemIndex = summaries.findIndex(s => {
        return s.key === id
      });
      if (itemIndex > 0) {
        newForensicsReports.push(...summaries.slice(0, itemIndex));
      }
    }  
  }
  
  res.status(200).json({
    forensics: newForensicsReports,
    latestBlockInfo,
    highestCommittedBlockInfo: {
      blockNumber: highestCommittedBlockInfo?.number || '0',
      blockHash: highestCommittedBlockInfo?.hash || ''
    }
  });
}

const getMasterNodeDetails = async (req, res) => {
  const {address} = req.query;
  const masterNodeInfo = await getMasterNodeInfo(address);
  res.status(200).json(masterNodeInfo);
}

// Test used controller
const saveForensicsEvent = async (req, res) => {
  const savedForensics = await saveForensicsReport(req.body);
  res.status(201).json(savedForensics);
}


module.exports ={
  getForensicsReports, getDetailedForensicsReport, getLatestForensicsReport, saveForensicsEvent, getMasterNodeDetails
}
