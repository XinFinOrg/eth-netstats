const express = require("express")
const router = express.Router()
const { healthCheck } = require('./health');
const { getForensicsReports, getDetailedForensicsReport, getLatestForensicsReport, getMasterNodeDetails } =  require('./forensics');

router.get('/health', healthCheck);
router.get('/forensics/masternode', getMasterNodeDetails);
router.get('/forensics/batch/load', getForensicsReports);
router.get('/forensics/load/detail', getDetailedForensicsReport);
router.get('/forensics/load/latest', getLatestForensicsReport);

module.exports = router;