var Pack = require('./Pack');
var Bitpusher = require('./Bitpusher');

module.exports = ExistencePack;

function ExistencePack(){
	this.encoding = 'existence';
	this.lastGuid = 0;
	this.runCounter = 0;
	this.bitpusher = new Bitpusher();
	this.outputBuffers = [];
}

ExistencePack.prototype = Object.create(Pack.prototype);

ExistencePack.prototype.initializePack = function(){};

ExistencePack.prototype.encode = function(guid){
	var guidDiff = guid - this.lastGuid;

	if(this.bitpusher.isEmpty() && !this.output && guid > 0){
		guidDiff += 1;
	}

	if(guidDiff === 1 || guid === 0){
		this.bitpusher.push(1);
		this.runCounter += 1;
	} else if(guidDiff <= 0){
		throw "Error: data was not sorted by GUID (got " + this.lastGuid + ", then " + guid + ")!";
	} else if(guidDiff > 40){
		this.dumpKeep(this.bitpusher, this.runCounter);

		this.outputBuffers.push(this.controlCode('skip', guidDiff - 1));

		this.bitpusher.clear();
		this.bitpusher.push(1);
		this.runCounter = 1;
	} else {
		if(this.runCounter > 40){
			this.dumpKeep(this.bitpusher, this.runCounter);
			this.bitpusher.clear();
			this.runCounter = 0;
		}

		this.bitpusher.pushMany(0, (guidDiff - 1));
		this.bitpusher.push(1);
		this.runCounter = 1;
	}

	this.lastGuid = guid;
}

ExistencePack.prototype.finalizePack = function(){
	this.dumpKeep(this.bitpusher, this.runCounter);
	this.buffer = Buffer.concat(this.outputBuffers);
}


ExistencePack.prototype.toPlainObject = function(){
	return {
		encoding: this.encoding,
		pack: this.encodedBitset()
	}
}

ExistencePack.prototype.dumpKeep = function(bitpusher, runLen){
	if(runLen >= 40){
		var length = bitpusher.length - runLen;
		this.dumpKeep(bitpusher.slice(0, length), 0);
		this.outputBuffers.push(this.controlCode('run', runLen));
	} else if(bitpusher.length > 0){
		this.outputBuffers.push(this.controlCode('keep', bitpusher.length));
		this.outputBuffers.push(bitpusher.getBuffer());
	}
}

ExistencePack.KEEP = 0x00;
ExistencePack.SKIP = 0x01;
ExistencePack.RUN = 0x02;

ExistencePack.prototype.controlCode = function(cmd, offset){
	offset = offset || 0;
	
	switch(cmd){
		case 'keep':
			var bytesToKeep = Math.floor(offset / 8);
			var remainingBits = offset % 8;

			buffer = new Buffer(6);
			buffer.writeUInt8(ExistencePack.KEEP, 0);
			buffer.writeUInt32BE(bytesToKeep, 1);
			buffer.writeUInt8(remainingBits, 5);
			
			break;
		case 'skip':
			buffer = new Buffer(5);

			buffer.writeUInt8(ExistencePack.SKIP, 0);
			buffer.writeUInt32BE(offset, 1);
			break;
		case 'run':
			buffer = new Buffer(5);
			buffer.writeUInt8(ExistencePack.RUN, 0);
			buffer.writeUInt32BE(offset, 1);
			break;
		default:
			throw 'Unknown control command: ' + cmd + '!';
	}

	return buffer;
}

