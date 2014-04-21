var _ = require('lodash');
var ExistencePack = require('./ExistencePack');
var createPack = require('./createPack');

module.exports = PackSet;

function PackSet(opts){
	opts = opts || {};
	this.meta = {};
	this.existencePack = new ExistencePack();
	this.attrPacks = {};
	this.bufferedAttrs = {};
	this.meta = opts;
};

PackSet.DEFAULT_GUID_ATTR = 'id';

PackSet.prototype.addAttribute = function(opts){
	['attrName', 'possibilities', 'maxChoices'].forEach(function(requiredOpt){
		if(opts[requiredOpt] === undefined) throw requiredOpt + " is required when adding an attribute!";
	});

	opts = _.clone(opts);

	var name = opts.attrName;
	delete opts.attrName;

	var possibilities = opts.possibilities;
	delete opts.possibilities;

	var maxChoices = opts.maxChoices;
	delete opts.maxChoices;

	var pack = createPack(name, possibilities, maxChoices);
	pack.meta = opts;

	this.attrPacks[name] = pack;

	return pack;
};

 // Buffered attributes will not be packed, but their metadata will be included in the PackSet's JSON
 // representation.  Clients will expect these attrs to be available via the <tt>buffer_url</tt>.
PackSet.prototype.addBufferedAttribute = function(opts){
	if(opts.attr_name === undefined) throw "attr_name is required when adding a buffered attribute!";

	opts = _.clone(opts);

	var attrName = opts.attrName;
	delete opts.attrName;

	this.bufferedAttrs[attrName] = _.extend({attrName: attrName}, opts);
};

PackSet.prototype.attributes = function(){
	return Object.keys(this.attrPacks);
};

PackSet.prototype.packFor = function(attr){
	return this.attrPacks[attr];
};

PackSet.prototype.pack = function(data, opts){
	opts = _.clone(opts) || {};

	// If guid attribute isn't specified use 'id';
	opts.guidAttr || (opts.guidAttr = PackSet.DEFAULT_GUID_ATTR);

	// If max guid isn't specified, use the guid of the last element in data
	opts.maxGuid || (opts.maxGuid = _.last(data)[opts.guidAttr]);

	// If number of items isn't specified used th length of data
	opts.numItems || (opts.numItems = data.length);

	this.buildPack(opts, data);
};

PackSet.prototype.buildPack = function(opts, items){
	opts || (opts = {});

	['numItems', 'maxGuid'].forEach(function(requiredOpt){
		if(opts[requiredOpt] === undefined) throw requiredOpt + " is required when adding an attribute!";
	});
	var existencePack = this.existencePack;

	var numItems = opts.numItems;
	var maxGuid = opts.maxGuid;
	var guidAttr = opts.guidAttr || PackSet.DEFAULT_GUID_ATTR;

	var packs = _.values(this.attrPacks);

	existencePack.initializePack(maxGuid, numItems);
	packs.forEach(function(pack){
		pack.initializePack(maxGuid, numItems);
	});

	var idx = 0;
	
	items.forEach(function packer(d){
		var guid = d[guidAttr];
		
		existencePack.encode(guid);
		
		packs.forEach(function(pack){ 
			pack.encode(idx, d); 
		});
		
		idx += 1;
	});

	existencePack.finalizePack();
	packs.forEach(function(p){
		p.finalizePack();
	})
};

PackSet.prototype.buildUnorderedPack = function(opts, items){
	var guidAttr = opts.guidAttr || 'id';
	var data = {};

	items.forEach(function extractor(d){
		var guid = d[guidAttr];
		data[guid] = d;
	});

	var sortedData = _.sortBy(data, function(d, key){ return key; });
	this.pack(sortedData, opts);
};

PackSet.prototype.toPlainObject = function(opts){
	opts = opts || {};

	var output = {
		version: '2.1',
		existence: this.existencePack.toPlainObject(),
		attributes: _.values(this.attrPacks).map(function(p){return p.toPlainObject();})
	}

	_.merge(output.attributes, _.values(this.bufferedAttrs));
	
	return _.merge(output, this.meta);
};

PackSet.prototype.toJSON = function(){
	return JSON.stringify(this.toPlainObject());
};
