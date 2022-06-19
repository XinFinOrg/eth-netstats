// Return the last X number of forensics events in timestamp order by X number of days
const getForensicsReports = (req, res) => {
  res.status(200);
};

// Return the detailed forensics report using the id from query
const getDetailedForensicsReport = (req, res) => {
  res.status(200);
};

// Check latest id. if the incoming id is older, then return whatever is newer
const getLatestForensicsReport = (req, res) => {
  res.status(200);
}

module.exports ={
  getForensicsReports, getDetailedForensicsReport, getLatestForensicsReport
}
