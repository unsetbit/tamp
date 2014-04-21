var _ = require('lodash');

module.exports = Pack;

function Pack(attrName, possibilities, maxChoices){
	if(!possibilities) throw 'Possibilities are empty for ' + attrName;

	this.possibilities = possibilities.map(function(a){ return '' + a});
	this.attrName = attrName;
	this.maxChoices = maxChoices;
	this.meta = {};

	this.encoding = null;
	this.bitWindowWidth = null;
	this.itemWindowWidth = null;
	this.buffer = null;
	this.bitCounter = 0;
	this.maxGuid = null;
}

Pack.prototype.toPlainObject = function(){
	var output = { 
		encoding: this.encoding,
		attr_name: this.attrName,
		possibilities: this.possibilities,
		pack: this.encodedBitset(),
		item_window_width: this.itemWindowWidth,
		bit_window_width: this.bitWindowWidth,
		max_choices: this.maxChoices 
	};

	return _.merge(output, this.meta);
}

Pack.prototype.finalizePack = function(){}

Pack.prototype.encodedBitset = function(){
	if(this.buffer && this.buffer.length){
		return this.buffer.toString('base64');
	}
}