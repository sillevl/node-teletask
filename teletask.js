
var net = require('net');

var request = require('./lib/request');
var functions = require('./lib/functions');
var settings = require('./lib/settings');

var util = require('util');
var EventEmitter = require('events').EventEmitter;

exports.functions = functions;
exports.settings = settings;

connect = function(host, port, callback){

	EventEmitter.call(this);

	var self = this;

	socket = new net.Socket;
	socket.connect(port, host, function() {
	   	if (typeof callback === "function") {
	    	callback();
	    }
	});

	socket.on('data', function(data) {
		if(data[0] != 10 && data.length != 1){
	    	self.emit('report', data.toString('hex'));
	    }
	});

	socket.on('close', function() {
	    console.log('Connection closed');
	});

	socket.on('error', function(err){
		console.log(err);
	});

	this.write = function(data){
		socket.write(data.toBinary());
		var timeout = setTimeout(function(){
			throw "Acknowledge timeout (1000ms)";
		}, 1000);
		socket.on('data', function(data) {
			if(data[0] == 10 && data.length == 1){
				clearTimeout(timeout);
			}
		});
	}

	this.set = function(fnc,number, setting, data){
	    request = new TeletaskSetRequest(fnc, number,setting);
	    socket.write(request.toBinary());
	}

	this.get = function(fnc, number){
		request = new TeletaskGetRequest(fnc, number);
	    return this.write(request);
	}

	this.logEnable = function(fnc){
		request = new TeletaskLogRequest(fnc, 255);
	    socket.write(request.toBinary());
	}

	this.logDisable = function(fnc){
		request = new TeletaskLogRequest(fnc, 0);
	    socket.write(request.toBinary());
	}

	this.keepalive = function(){
		request = new TeletaskKeepAliveRequest();
	    socket.write(request.toBinary());
	}
}

util.inherits(connect, EventEmitter);

exports.connect = connect;