
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

	var report = {
		fnc: functions.getKey(fnc),
		number: getNumber(data),
		central: getCentral(data),
		size: getSize(data)
	};

	switch (fnc) {
		case functions.relay:
			var value = getValue(data);
			report.status = settings.getKey(value);
			break;
		case functions.dimmer:
			report.status = getValue(data);
			break;
		case functions.sensor:
			report.temperature = getTemperature(readShort(data,8));
			report.thermostate = {
				day: getTemperature(readShort(data,12)),
				night: getTemperature(readShort(data,14)),
				standby_preset: (data[16] / 10),
				mode: settings.getKey(data[18], 'temperature_mode'),
				speed: settings.getKey(data[19], 'temperature_speed')
			};
			report.getTemperature = function(unit){return getTemperature(readShort(data,8), unit);};
			break;
	}

	return report;
};

exports.parse = parse;

getStartByte = function(data){
	return data[0];
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
	return data[4];
};

getNumber = function(data){
	return readShort(data, 5);
};

getValue = function(data){
	return readShort(data, 7);
};

readShort = function(data, startIndex){
	return (data[startIndex] * 256) + data[startIndex+1];
};

getChecksum = function(data){
	var size = getSize(data);
	return data[size];
};

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
	if(data.size <= getSize(data)){
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
		return value / 10;
	} else if(unit === "fahrenheit"){
		return (((value / 10) - 273) * (9/5)) + 32;
	} else {
		return (value / 10) - 273 ;
	}
};
