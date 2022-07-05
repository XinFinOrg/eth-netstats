const NodeCache = require( "node-cache" );

const cache = new NodeCache();
const CACHE_KEY = 'recentForensics';
const Forensics = require('../db/models/forensicsModel');
const { convertToSummary, convertToDetails} = require('./utils');

const saveForensicsReport = async (forensicsReport) => {
  if(!forensicsReport || !forensicsReport.forensicsType) {
    console.error("Empty Forensics report received!")
    throw new Error("Incoming forensics is empty");
  }
  // Replace by forensicsReport.id after changes made in XDC Chain
  const forensicsId = JSON.parse(forensicsReport.content).id;
  const dbItem = await Forensics.findOne({_id: forensicsId});
  // Save the new item if not found duplicates
  if (!dbItem) {
    const forensicsEvent = new Forensics({
      _id: forensicsId,
      forensicsType: forensicsReport.forensicsType,
      date: new Date().toISOString(),
      content: forensicsReport.content
    });
    await forensicsEvent.save();
    cache.flushAll();
    return forensicsEvent;
  }
  // Skip if there is already a duplicate
  return;
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