
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
	    } else {
	    	console.log('data received: ' + data.toString('hex'));
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
	    var request = new Set(fnc, number,setting);
	    this.write(request);
	}

	this.get = function(fnc, number){
		var request = new Get(fnc, number);
	    this.write(request);
	}

	this.groupget = function(fnc, numbers){
		var request = new GroupGet(fnc, numbers);
	    this.write(request);
	}

	this.logEnable = function(fnc){
		var request = new Log(fnc, settings.on);
	    this.write(request);
	}

	this.logDisable = function(fnc){
		var request = new Log(fnc, settings.off);
	    this.write(request);
	}

	this.keepalive = function(){
		var request = new KeepAlive();
	    this.write(request);
	}
}

util.inherits(connect, EventEmitter);

exports.connect = connect;