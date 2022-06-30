var _ = require('lodash');


const convertToDetails = (dbItem) => {
  const eventContent = JSON.parse(dbItem.content);
  return {
    key: dbItem._id.toString(),
    eventTime: dbItem.eventTime,
    forensicsType: dbItem.forensicsType,
    divergingBlockNumber: eventContent.divergingBlockNumber,
    divergingBlockHash: eventContent.divergingBlockHash,
    suspeciousNodes: getSuspeciousNodes(eventContent),
    attackType: eventContent.acrossEpoch ? 'ATTACK' : 'PRONE_TO_NETWORK', // TODO: need to build the prone to attack
    divergingPathsMap: buildDivergingPathsMap(eventContent.divergingBlockHash, eventContent.smallerRoundInfo.hashPath, eventContent.largerRoundInfo.hashPath),
    fork1: eventContent.smallerRoundInfo.quorumCert.ProposedBlockInfo,
    fork2: eventContent.largerRoundInfo.quorumCert.ProposedBlockInfo,
  }
}

const buildDivergingPathsMap = (divergingBlockHash, path1, path2) => {
  return {
    'name': divergingBlockHash,
    children: [pathToMap(path1), pathToMap(path2)]
  }
}

const pathToMap = (path) => {
  return _.reduceRight(path, (acc, curr, index) => {
    if (index == path.length -1) {
      return {
        name: curr
      }
    }
    return {
      name: curr,
      children: [acc]
    }
  }, {});
}

const convertToSummary = (dbItem) => {
  const reportContent = JSON.parse(dbItem.content);
  return {
    key: dbItem._id.toString(),
    eventTime: dbItem.eventTime,
    forensicsType: dbItem.forensicsType,
    divergingBlockNumber: reportContent.divergingBlockNumber,
    divergingBlockHash: reportContent.divergingBlockHash,
    numberOfSuspeciousNodes: getSuspeciousNodes(reportContent).length
  }
}

const getSuspeciousNodes = (content) => {
  // TODO: Different types have different fields to filter
  const smallerRoundInfoSingerAddresses = content.smallerRoundInfo.signerAddresses;
  const largerRoundInfoSingerAddresses = content.smallerRoundInfo.signerAddresses;
  return smallerRoundInfoSingerAddresses.filter(value => largerRoundInfoSingerAddresses.includes(value));
}

module.exports = { convertToSummary, convertToDetails}