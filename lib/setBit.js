module.exports = function setBit(buffer, offset, bit){
	var octetIndex = Math.floor(offset / 8);
	var mask = 1 << 7 - (offset % 8);
	var octet = buffer[octetIndex];
	
	buffer[octetIndex] = bit ? 
		octet | mask : 
		octet & ~mask;
};
