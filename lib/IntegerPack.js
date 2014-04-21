var Pack = require('./Pack');
var setBit = require('./setBit');

module.exports = IntegerPack;

function log2(x){ return Math.log(x) / Math.LN2; }

function IntegerPack(attrName, possibilities, maxChoices){
	Pack.call(this, attrName, possibilities, maxChoices);
	this.encoding = "integer";
}

IntegerPack.prototype = Object.create(Pack.prototype);

IntegerPack.prototype.encode = function(idx, data){
	var self = this;
	var buffer = this.buffer;
	var choices = data[this.attrName];
	if(!Array.isArray(choices)) choices = [choices];
	
	var i = 0,
		len = this.maxChoices;

	for(; i < len; i++){
		var choiceOffset = (this.itemWindowWidth) * idx + (this.bitWindowWidth * i);
		var value = choices[i];
		
		var possibilityIndex = this.possibilities.indexOf(value);
		if(possibilityIndex === -1) continue;
		
		possibilityId = possibilityIndex + 1;

		var bitCode = possibilityId.toString(2).split('');
		var bitCodeLengthPad = this.bitWindowWidth - bitCode.length;

		var bitOffset = this.baseOffset + choiceOffset + bitCodeLengthPad;

		bitCode.forEach(function(bit, index){
			var offset = bitOffset + index;
			self.bitCounter++;
			setBit(buffer, offset, bit === '1');
		});
	}
};


IntegerPack.HEADER_OCTETS = 5;
IntegerPack.prototype.initializePack = function(maxGuide, numItems){
	this.baseOffset = IntegerPack.HEADER_OCTETS * 8;

	this.bitWindowWidth = Math.ceil(log2(this.possibilities.length + 1)) || 1;
	this.itemWindowWidth = this.bitWindowWidth * this.maxChoices;

	var bits = this.itemWindowWidth * numItems + this.baseOffset;
	var octets = Math.ceil(bits / 8);
	this.numItems = numItems;
	this.buffer = new Buffer(new Array(octets));

	var dataLength = this.itemWindowWidth * numItems;
	var byteLength = (dataLength / 8)|0;
	var remainingBits = dataLength % 8;

	this.buffer.writeUInt32BE(byteLength, 0);
	this.buffer.writeUInt8(remainingBits, 4);
};
