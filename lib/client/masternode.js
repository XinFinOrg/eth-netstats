const {config} = require('../../config');
const axios = require('axios').default;

const instance = axios.create({
  baseURL: config.masternodeUrl,
  timeout: 10000
});

const getMasterNodeInfo = async (nodeAddress) => {
  try {
    const {data} = await instance.get(`/candidates/${nodeAddress}`);
    return data
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { getMasterNodeInfo }