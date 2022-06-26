const NodeCache = require( "node-cache" );

const cache = new NodeCache();
const CACHE_KEY = 'recentForensics';
const Forensics = require('../db/models/forensicsModel');
const { convertToSummary, convertToDetails} = require('./utils');

const saveForensicsReport = async (report) => {
  const forensicsEvent = new Forensics({
    forensicsType: report.forensicsType,
    date: new Date().toISOString(),
    content: JSON.stringify(report)
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
    eventTime: {
      $gte: beforeDate, 
    }
  }).sort('-eventTime');
  const summaries = reports.map(r => {
    return convertToSummary(r);  
  });
  return summaries;
}

// Return the last 30 events
const bulkGetLatestSummary = async() => {
  if (cache.get(CACHE_KEY)) {
    return cache.get(CACHE_KEY);
  }
  reports = await Forensics.find().sort('-eventTime').limit(30);
  const summaries = reports.map(r => {
    return convertToSummary(r);  
  });
  cache.set(CACHE_KEY, summaries)
  return summaries;
}


const findDetailedForensicsById = async(id) => {
  const dbItem = await Forensics.findOne({_id: id});
  // Not found
  if (!dbItem) {
    return {}
  }
  const detailedForensics = convertToDetails(dbItem);
  const previousItem = await Forensics.find({_id: {$lt: id}}).sort({_id: -1 }).limit(1);
  if (previousItem && previousItem.length) {
    detailedForensics.timeSinceLastEvent = Math.round(((dbItem.eventTime - previousItem[0].eventTime))/1000)
  }
  
  
  return detailedForensics;
}



module.exports = { saveForensicsReport, bulkGetEventsSummary, bulkGetLatestSummary, findDetailedForensicsById }