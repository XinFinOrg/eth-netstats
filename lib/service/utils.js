var _ = require('lodash');


const convertToDetails = (dbItem) => {
  const eventContent = JSON.parse(dbItem.content);
  const forensicsType = dbItem.forensicsType;
  
  switch (forensicsType) {
    case 'QC':
      return {
        key: dbItem._id.toString(),
        eventTime: dbItem.eventTime,
        forensicsType,
        details: {
          suspeciousNodes: getSuspeciousNodes(eventContent, forensicsType),
          attackType: eventContent.acrossEpoch ? 'PRONE_TO_NETWORK' : 'ATTACK',
          divergingBlockNumber: eventContent.divergingBlockNumber,
          divergingBlockHash: eventContent.divergingBlockHash,
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
    case 'Vote':
      return {
        key: dbItem._id.toString(),
        eventTime: dbItem.eventTime,
        forensicsType,
        details: {
          suspeciousNodes: getSuspeciousNodes(eventContent, forensicsType),
          attackType: 'ATTACK',
          vote1: {
            blockInfo: eventContent.smallerRoundVote.ProposedBlockInfo
          },
          vote2: {
            blockInfo: eventContent.largerRoundVote.ProposedBlockInfo
          }
        }
      }
    default:
      throw new Error("Forensics type not recognised when converting to details");
  }
}

const buildDivergingPathsMap = (divergingBlockHash, path1, path2) => {
  if (divergingBlockHash!= path1[0] && path1[0] != path2[0]) {
    console.error(`Diverging block not match in the hash path 1 and 2. divergingHash: ${divergingBlockHash}, path1[0]: ${path1[0]}, path2[0]: ${path2[0]}` )
    throw new Error("Hash path diverging block mismatch!");
  }
  return {
    'name': divergingBlockHash.slice(0, 4) + '...' + divergingBlockHash.slice(-4),
    children: [pathToMap(path1.slice(1)), pathToMap(path2.slice(1))]
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
  const forensicsType = dbItem.forensicsType;
  const suspeciousNodes = getSuspeciousNodes(reportContent, forensicsType);
  const affectedBlockNum = calculateAffectedBlockNum(reportContent, forensicsType);
  return {
    key: dbItem._id.toString(),
    eventTime: dbItem.eventTime,
    forensicsType,
    affectedBlockNum: affectedBlockNum,
    suspeciousNodes,
    numberOfSuspeciousNodes: suspeciousNodes.length
  }
}

// Always get the smaller round blockInfo. This is used to display in the summary table.
const calculateAffectedBlockNum = (content, forensicsType) => {
  switch (forensicsType) {
    case 'QC':
      return content.smallerRoundInfo.quorumCert.ProposedBlockInfo.Number;
    case 'Vote':
      return content.smallerRoundVote.ProposedBlockInfo.Number;
    default:
      console.error("Forensics type not recoginised when calculating affected BlockNum", forensicsType);
      throw new Error("Unregonised Forensics Type!");
  }
}
const getSuspeciousNodes = (content, forensicsType) => {
  
  switch (forensicsType) {
    case 'QC':
      const smallerRoundInfoSingerAddresses = content.smallerRoundInfo.signerAddresses;
      const largerRoundInfoSingerAddresses = content.smallerRoundInfo.signerAddresses;
      return smallerRoundInfoSingerAddresses.filter(value => largerRoundInfoSingerAddresses.includes(value));
    case 'Vote':
      return [content.signer]
    default:
      console.error("Forensics type not recoginised", forensicsType);
      throw new Error("Unregonised Forensics Type!");
  }
  
}

module.exports = { convertToSummary, convertToDetails}