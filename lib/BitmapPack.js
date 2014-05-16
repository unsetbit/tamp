var Pack = require('./Pack');
var setBit = require('./setBit');

module.exports = BitmapPack;

function log2(x){ return Math.log(x) / Math.LN2;}

function BitmapPack(attrName, possibilities, maxChoices){
	Pack.call(this, attrName, possibilities, maxChoices);
	this.encoding = "bitmap";
}

BitmapPack.prototype = Object.create(Pack.prototype);

BitmapPack.prototype.encode = function(idx, data){
	var buffer = this.buffer;
	var self = this;
	var choices = data[this.attrName];
	if(!Array.isArray(choices)) choices = [choices];

	var itemOffset = idx * this.itemWindowWidth;
	var bitOffset = itemOffset + this.baseOffset;
	
	choices.forEach(function(choice){
		var choiceOffset = self.possibilities.indexOf(choice);
		if(choiceOffset !== -1){
			setBit(buffer, itemOffset + choiceOffset, true);
		}
	});
};

BitmapPack.HEADER_OCTETS = 5;
BitmapPack.prototype.initializePack = function(maxGuid, numItems){
	this.baseOffset = BitmapPack.HEADER_OCTETS * 8;
	this.bitWindowWidth = 1;
	this.itemWindowWidth = this.possibilities.length;

	var bits = this.itemWindowWidth * numItems + this.baseOffset;
	var octets = Math.ceil(bits / 8);

	this.buffer = new Buffer(new Array(octets));

	var dataLength = this.itemWindowWidth * numItems;
	var byteLength = (dataLength / 8)|0;
	var remainingBits = dataLength % 8;

	this.buffer.writeUInt32BE(byteLength, 0);
	this.buffer.writeUInt8(remainingBits, 4);	
};
