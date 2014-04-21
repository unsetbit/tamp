var IntegerPack = require('./IntegerPack'),
	BitmapPack = require('./BitmapPack');

function log2(x){ return Math.log(x) / Math.LN2;}

module.exports = function createPack(attr_name, possibilities, max_choices){
	var PackConstructor;

	if ((max_choices * log2(possibilities.length)) < possibilities.length){
		PackConstructor = IntegerPack;
	} else {
		PackConstructor = BitmapPack;
	}

	return new PackConstructor(attr_name, possibilities, max_choices);
};