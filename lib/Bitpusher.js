// This is a helper module for ExistancePack. A small abstraction on top of a bitset
// to treat the set as a stack which things can be "pushed" on to.

var createBitsy = require('bitsy');

module.exports = Bitpusher;

function Bitpusher(){
	this.clear();
};

Bitpusher.prototype.push = function(bit){
	var index = this.length;
	if(bit){
		this.bitset.set(index, true);
	}

	this.length += 1;
	if(this.bitset.length <= this.length){
		this.bitset.setSize(this.bitset.length * 2);
	}
};

Bitpusher.prototype.pushMany = function(bit, howMany){
	if(howMany <= 0) return;

	while(howMany--) this.push(bit);
};

Bitpusher.prototype.clear = function(){
	this.bitset = createBitsy(8);
	this.length = 0;
};

Bitpusher.prototype.slice = function(begin, end){
	var bitpusher = new Bitpusher();
	bitpusher.bitset = this.bitset.slice(begin, end);
	bitpusher.length = end;
	return bitpusher;
};

Bitpusher.prototype.getBuffer = function(){
	return this.bitset.slice(0, this.length).getBuffer();
};

Bitpusher.prototype.isEmpty = function(){ return this.length === 0; };