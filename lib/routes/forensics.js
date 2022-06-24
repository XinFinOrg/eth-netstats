
const { saveForensicsReport, bulkGetEventsSummary, bulkGetLatestSummary} = require("../service/mongo");

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
  
  res.status(200).send(reports);
};

// Return the detailed forensics report using the id from query
const getDetailedForensicsReport = (req, res) => {
  const {id} = req.query;
  res.status(200);
};

// Check latest id. if the incoming id is older, then return whatever is newer
const getLatestForensicsReport = async (req, res) => {
  const {id} = req.query;
  const newForensicsReports = [];
  if (!id) {
    // This is a special case where 0 forensics has ever happened. To save some DB operations, we skip the realtime polling
    return res.status(200).send([]);
  }
  
  const summaries = await bulkGetLatestSummary();
  if(summaries.length) {
    const itemIndex = summaries.findIndex(s => {
      return s.id === id
    });
    if (itemIndex) {
      newForensicsReports.push(...summaries.slice(0, itemIndex));
    }
  }
  res.status(200).send(newForensicsReports);
}

// Test used controller
const saveForensicsEvent = async (req, res) => {
  const savedForensics = await saveForensicsReport(req.body);
  res.status(201).send(savedForensics);
}


module.exports ={
  getForensicsReports, getDetailedForensicsReport, getLatestForensicsReport, saveForensicsEvent
}
