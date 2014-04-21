var PackSet = require('./PackSet');
module.exports = function createPackSet(){
	return new PackSet();
};

module.exports.PackSet = PackSet;