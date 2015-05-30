
var commands = require('./commands');
var functions = require('./functions');
var settings = require('./settings');

parse = function(report){
	report = Array.prototype.slice.call(new Uint8Array(report));

	checkStartByte(report);
	checkSize(report);
	checkCheckSum(report);

	var command = getCommand(report);
	var fnc = getFunction(report);
	var value = getValue(report);

	return {
		start: getStartByte(report), 
		size: getSize(report),
		command: {command: command, name: commands.getKey(command) },
		central: getCentral(report),
		fnc: {fnc: fnc, name: functions.getKey(fnc) },
		number: getNumber(report),
		value: {value: value, name: settings.getKey(value) },
		checksum: getChecksum(report)

	};
};

exports.parse = parse;

getStartByte = function(data){
	return data[0]
};

getSize = function(data){
	return data[1];
};

getCommand = function(data){
	return data[2];
};

getCentral = function(data){
	return data[3];
};

getFunction = function(data){
	return data[4]
};

getNumber = function(data){
	return (data[5] * 256) + data[6];
};

getValue = function(data){
	return (data[7] * 256) + data[8];
};

getChecksum = function(data){
	var size = getSize(data);
	return data[size];
}

calculateCheckSum = function(data){
	return data.slice(0,-1).reduce(
		function(prev,current){
			return  current + prev;
		}
	) % 256;
};

checkStartByte = function(data){
	if(getStartByte(data) != 2){
		throw "Parse error, wrong start byte";
	}
};

checkSize = function(data, size){
	var size = getSize(data);
	if(data.size <= size){
		throw "Parse error, report length to short";
	}
};

checkCheckSum = function(data){
	var size = getSize(data);
	var checksum = getChecksum(data);
	var calculated = calculateCheckSum(data);
	if(calculated != checksum){
		throw "Parse error, checksum incorrect. Calculated " + calculated + " must be " + checksum;
	}
};
