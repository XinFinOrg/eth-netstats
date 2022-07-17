var _ = require('lodash');
var {getBlockChain} = require('./history');
var Node = require('./node');


class Collection {
  constructor(externalAPI) {
    this._items = [];
  	this._blockchain = getBlockChain();
  	this._askedForHistory = false;
  	this._askedForHistoryTime = 0;
  	this._debounced = null;
  	this._externalAPI = externalAPI;
  	this._highestBlock = 0;
  	this._highestCommittedBlock = {
  	  number: 0,
  	  hash: '',
  	  round: 0
  	}
  }
  
  setupSockets() {
    this._externalAPI.on('connection', function (spark)
  	{
  		this._externalAPI.on('latestBlock', function (data)
  		{
  			spark.emit('latestBlock', {
  				number: this._highestBlock
  			});
  		});
  	});
  }
  
  add(data, callback) {
  	var node = this.getNodeOrNew({ id : data.id }, data);
  	node.setInfo(data, callback);
  }
  
  update(id, stats, callback)
  {
  	var node = this.getNode({ id: id });
  
  	if (!node)
  	{
  		callback('Node not found', null);
  	}
  	else
  	{
  		// this._blockchain.clean(this.getBestBlockFromItems());
  
  		var block = this._blockchain.add(stats.block, id, node.trusted);
  
  		if (!block)
  		{
  			callback('Block data wrong', null);
  		}
  		else
  		{
  			var propagationHistory = this._blockchain.getNodePropagation(id);
  
  			stats.block.arrived = block.block.arrived;
  			stats.block.received = block.block.received;
  			stats.block.propagation = block.block.propagation;
  
  			node.setStats(stats, propagationHistory, callback);
  		}
  	}
  }
  
  addBlock(id, stats, latestCommittedBlockInfo, callback) {
  	var node = this.getNode({ id: id });
  
    if (!node)
  	{
  		callback('Node not found', null);
  	}
  	else
  	{
  		// this._blockchain.clean(this.getBestBlockFromItems());
  
  		var block = this._blockchain.add(stats, id, node.trusted);
  
  		if (!block)
  		{
  			callback('Block undefined', null);
  		}
  		else
  		{
  			var propagationHistory = this._blockchain.getNodePropagation(id);
  
  			stats.arrived = block.block.arrived;
  			stats.received = block.block.received;
  			stats.propagation = block.block.propagation;
  
  			if(block.block.number > this._highestBlock)
  			{
  				this._highestBlock = block.block.number;
  				this._externalAPI.write({
  					action:"lastBlock",
  					number: this._highestBlock
  				});
  			}
  			
  			if(latestCommittedBlockInfo && latestCommittedBlockInfo.number && latestCommittedBlockInfo.number > this._highestCommittedBlock.number) {
  			  this._highestCommittedBlock = latestCommittedBlockInfo
  			}
  
  			node.setBlock(stats, propagationHistory, latestCommittedBlockInfo, callback);
  		}
  	}
  }
  
  updatePending(id, stats, callback) {
  	var node = this.getNode({ id: id });
  
  	if (!node)
  		return false;
  
  	node.setPending(stats, callback);
  }
  
  updateStats(id, stats, callback) {
  	var node = this.getNode({ id: id });
  
  	if (!node)
  	{
  		callback('Node not found', null);
  	}
  	else
  	{
  		node.setBasicStats(stats, callback);
  	}
  }
  
  // TODO: Async series
  addHistory(id, blocks, callback) {
  	var node = this.getNode({ id: id });
  
  	if (!node)
  	{
  		callback('Node not found', null)
  	}
  	else
  	{
  		blocks = blocks.reverse();
  
  		// this._blockchain.clean(this.getBestBlockFromItems());
  
  		for (var i = 0; i <= blocks.length - 1; i++)
  		{
  			this._blockchain.add(blocks[i], id, node.trusted, true);
  		};
  
  		this.getCharts();
  	}
  
  	this.askedForHistory(false);
  }
  
  updateLatency(id, latency, callback) {
  	var node = this.getNode({ id: id });
  
  	if (!node)
  		return false;
  
  	node.setLatency(latency, callback);
  }
  
  inactive(id, callback) {
  	var node = this.getNode({ spark: id });
  
  	if (!node)
  	{
  		callback('Node not found', null);
  	}
  	else
  	{
  		node.setState(false);
  		callback(null, node.getStats());
  	}
  }
  
  getIndex(search) {
  	return _.findIndex(this._items, search);
  }
  
  getNode(search) {
  	var index = this.getIndex(search);
  
  	if(index >= 0)
  		return this._items[index];
  
  	return false;
  }
  
  getNodeByIndex(index) {
  	if(this._items[index])
  		return this._items[index];
  
  	return false;
  }
  
  getIndexOrNew(search, data) {
  	var index = this.getIndex(search);
  
  	return (index >= 0 ? index : this._items.push(new Node(data)) - 1);
  }
  
  getNodeOrNew(search, data) {
  	return this.getNodeByIndex(this.getIndexOrNew(search, data));
  }
  
  all() {
  	this.removeOldNodes();
  
  	return this._items;
  }
  
  removeOldNodes() {
  	var deleteList = []
  
  	for(var i = this._items.length - 1; i >= 0; i--) {
  		if( this._items[i].isInactiveAndOld() )
  		{
  			deleteList.push(i);
  		}
  	}
  
  	if(deleteList.length > 0) {
  		for(var i = 0; i < deleteList.length; i++)
  		{
  			this._items.splice(deleteList[i], 1);
  		}
  	}
  }
  
  blockPropagationChart() {
  	return this._blockchain.getBlockPropagation();
  }
  
  getUncleCount() {
  	return this._blockchain.getUncleCount();
  }
  
  setChartsCallback(callback) {
  	this._blockchain.setCallback(callback);
  }
  
  getCharts() {
  	this.getChartsDebounced();
  }
  
  getChartsDebounced() {
  	var self = this;
  
  	if( this._debounced === null) {
  		this._debounced = _.debounce(function(){
  			self._blockchain.getCharts();
  		}, 1000, {
  			leading: false,
  			maxWait: 5000,
  			trailing: true
  		});
  	}
  
  	this._debounced();
  }
  
  getHistory() {
  	return this._blockchain;
  }
  
  getBestBlockFromItems() {
  	return Math.max(this._blockchain.bestBlockNumber(), _.result(_.max(this._items, function(item) {
  		// return ( !item.trusted ? 0 : item.stats.block.number );
  		return ( item.stats.block.number );
  	}), 'stats.block.number', 0));
  }
  
  canNodeUpdate(id) {
  	var node = this.getNode({id: id});
  
  	if(!node)
  		return false;
  
  	if(node.canUpdate())
  	{
  		var diff = node.getBlockNumber() - this._blockchain.bestBlockNumber();
  
  		return Boolean(diff >= 0);
  	}
  
  	return false;
  }
  
  requiresUpdate(id) {
  	return ( this.canNodeUpdate(id) && this._blockchain.requiresUpdate() && (!this._askedForHistory || _.now() - this._askedForHistoryTime > 2*60*1000) );
  }
  
  askedForHistory(set) {
  	if( !_.isUndefined(set) )
  	{
  		this._askedForHistory = set;
  
  		if(set === true)
  		{
  			this._askedForHistoryTime = _.now();
  		}
  	}
  
  	return (this._askedForHistory || _.now() - this._askedForHistoryTime < 2*60*1000);
  }
  
  getHighestCommittedBlockInfo() {
    return this._highestCommittedBlock;
  }
  
  getBestBlock() {
    return this._blockchain.bestBlock();
  }
}

let collection;

const initCollection = (externalApi) => {
  if(!collection) {
    collection = new Collection(externalApi)
  }
}

const getCollection = () => {
  if(!collection) {
    throw new Error("Collection not initialized!")
  }
  return collection;
}

module.exports = { initCollection, getCollection };
