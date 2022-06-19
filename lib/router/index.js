const { healthCheck } = require('./health');



const attachRouters = (app) =>{
  app.get('/health', (req, res) => {
    healthCheck(req, res);
  });
};





module.exports = { attachRouters };