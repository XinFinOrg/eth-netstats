const express = require("express")
const router = express.Router()
const { healthCheck } = require('./health');
const { getForensicsReports, getDetailedForensicsReport, getLatestForensicsReport, getMasterNodeDetails, saveForensicsEvent } =  require('./forensics');


const asyncWrapper = (cb) => {
  return (req, res, next) => cb(req, res, next).catch(next);
};

router.get('/health', healthCheck);
router.get('/forensics/masternode', asyncWrapper(getMasterNodeDetails));
router.get('/forensics/batch/load', asyncWrapper(getForensicsReports));
router.get('/forensics/load/detail', asyncWrapper(getDetailedForensicsReport));
router.get('/forensics/load/latest', asyncWrapper(getLatestForensicsReport));



module.exports = router;