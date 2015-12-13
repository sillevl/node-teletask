
var commands = require('./commands');
var functions = require('./functions');
var settings = require('./settings');

parse = function(data){
	data = Array.prototype.slice.call(new Uint8Array(data));

	checkStartByte(data);
	checkSize(data);
	checkCheckSum(data);

	var command = getCommand(data);
	var fnc = getFunction(data);
	var value = getValue(data);

	var report = {
		start: getStartByte(data),
		size: getSize(data),
		command: {command: command, name: commands.getKey(command) },
		central: getCentral(data),
		fnc: {fnc: fnc, name: functions.getKey(fnc) },
		number: getNumber(data),
		value: {value: value, name: settings.getKey(value) },
		checksum: getChecksum(data),
	};

	if(fnc == functions.sensor){
		report.getTemperature = function(unit){return getTemperature(value, unit);};
	}

	return report;
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
	var size = getSize(data);
	return data.slice(0,size).reduce(
		function(prev,current){
			return  current + prev;
		}
	) % 256;
};

checkStartByte = function(data){
	if(getStartByte(data) != 2){
		throw "Parse error, wrong start byte" + " (" + data.toString() + ")";
	}
};

checkSize = function(data, size){
	var size = getSize(data);
	if(data.size <= size){
		throw "Parse error, report length to short" + " (" + data.toString() + ")";
	}
};

checkCheckSum = function(data){
	var size = getSize(data);
	var checksum = getChecksum(data);
	var calculated = calculateCheckSum(data);
	if(calculated != checksum){
		throw "Parse error, checksum incorrect. Calculated " + calculated + " must be " + checksum + " (" + data.toString() + ")";
	}
};

getTemperature = function(value, unit){
	if(unit === "kelvin"){
		return (value / 10) - 273.15;
	} else if(unit === "fahrenheit"){
		return ((value / 10) * (9/5)) + 32;
	} else {
		return value / 10;
	}
};
