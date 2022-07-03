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
    attackType: eventContent.acrossEpoch ? 'PRONE_TO_NETWORK' : 'ATTACK', // TODO: need to build the prone to attack
    divergingPathsMap: buildDivergingPathsMap(eventContent.divergingBlockHash, eventContent.smallerRoundInfo.hashPath, eventContent.largerRoundInfo.hashPath),
    fork1: {
      blockInfo: eventContent.smallerRoundInfo.quorumCert.ProposedBlockInfo,
      hashPath: eventContent.smallerRoundInfo.hashPath
    },
    fork2: {
      blockInfo: eventContent.largerRoundInfo.quorumCert.ProposedBlockInfo,
      hashPath: eventContent.largerRoundInfo.hashPath
    }
  }
}

const buildDivergingPathsMap = (divergingBlockHash, path1, path2) => {
  return {
    'name': divergingBlockHash.slice(0, 4) + '...' + divergingBlockHash.slice(-4),
    children: [pathToMap(path1), pathToMap(path2)]
  }
}

const pathToMap = (path) => {
  return _.reduceRight(path, (acc, currHash, index) => {
    const shorthandedHash = currHash.slice(0, 4) + '...' + currHash.slice(-4);
    if (index == path.length -1) {
      return {
        name: shorthandedHash
      }
    }
    return {
      name: shorthandedHash,
      children: [acc]
    }
  }, {});
}

const convertToSummary = (dbItem) => {
  const reportContent = JSON.parse(dbItem.content);
  const suspeciousNodes = getSuspeciousNodes(reportContent);
  return {
    key: dbItem._id.toString(),
    eventTime: dbItem.eventTime,
    forensicsType: dbItem.forensicsType,
    divergingBlockNumber: reportContent.divergingBlockNumber,
    divergingBlockHash: reportContent.divergingBlockHash,
    suspeciousNodes,
    numberOfSuspeciousNodes: suspeciousNodes.length
  }
}

const getSuspeciousNodes = (content) => {
  // TODO: Different types have different fields to filter
  const smallerRoundInfoSingerAddresses = content.smallerRoundInfo.signerAddresses;
  const largerRoundInfoSingerAddresses = content.smallerRoundInfo.signerAddresses;
  return smallerRoundInfoSingerAddresses.filter(value => largerRoundInfoSingerAddresses.includes(value));
}

module.exports = { convertToSummary, convertToDetails}