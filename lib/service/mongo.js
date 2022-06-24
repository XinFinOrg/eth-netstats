const { v4: uuidv4 } = require('uuid');
const NodeCache = require( "node-cache" );

const cache = new NodeCache();
const CACHE_KEY = 'recentForensics';
const Forensics = require('../db/models/forensicsModel');

const saveForensicsReport = async (report) => {
  const forensicsEvent = new Forensics({
    id: uuidv4(),
    date: new Date().toISOString(),
    ...report
  });
  await forensicsEvent.save();
  cache.flushAll();
  return forensicsEvent;
}

const bulkGetEventsSummary = async(beforeDate) => {
  let reports;
  if (!beforeDate) {
    reports = await Forensics.find();
  }
  reports = await Forensics.find({
    createdAt: {
      $gte: beforeDate, 
    }
  }).sort('-createdAt');
  const summaries = reports.map(r => {
    return convertToSummary(r);  
  });
  return summaries;
}

// Return the last 30 events
const bulkGetLatestSummary = async() => {
  if (cache.get(CACHE_KEY)) {
    console.log("from cache!", cache.get(CACHE_KEY))
    return cache.get(CACHE_KEY);
  }

  reports = await Forensics.find().sort('-createdAt').limit(30);
  const summaries = reports.map(r => {
    return convertToSummary(r);  
  });
  console.log("setting the cache!", summaries)
  cache.set(CACHE_KEY, summaries)
  return summaries;
}


const findForensicsById = async(id) => {
}

const convertToSummary = (report) => {
  return {
    id: report._id.toString(),
    timestamp: report.createdAt,
    divergingBlockNumber: report.DivergingBlockNumber,
    divergingBlockHash: report.DivergingHash,
    suspeciousNodes: calculateNumberOfSuspeciousNodes(report)
  }
}

const calculateNumberOfSuspeciousNodes = (report) => {
  const SmallerRoundInfoSingerAddresses = report.SmallerRoundInfo.SignerAddresses;
  const largerRoundInfoSingerAddresses = report.SmallerRoundInfo.SignerAddresses;
  return SmallerRoundInfoSingerAddresses.filter(value => largerRoundInfoSingerAddresses.includes(value));
}


module.exports = {saveForensicsReport, bulkGetEventsSummary, bulkGetLatestSummary, findForensicsById}