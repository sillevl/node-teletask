
var net = require('net');

var request = require('./lib/request');
var functions = require('./lib/functions');
var settings = require('./lib/settings');
var Report = require('./lib/report');

var util = require('util');
var EventEmitter = require('events').EventEmitter;

exports.functions = functions;
exports.settings = settings;

connect = function(host, port, callback){

	var i = 0;

	EventEmitter.call(this);

	var self = this;

	socket = new net.Socket;
	socket.connect(port, host, function() {
	   	if (typeof callback === "function") {
	    	callback();
	    }
	});

/*	socket.on('data', function(data) {
		if(data[0] != 10 && data.length != 1){
	    	self.emit('report', Report.parse(data));
	    } 
	});*/

	socket.on('close', function() {
	    console.log('Connection closed');
	});

	socket.on('error', function(err){
		console.log(err);
	});

	this.write = function(data, callback){
		socket.write(data.toBinary(), function(){
			g = function(data) {
				console.log("indexof: " + data.toString('hex').indexOf(2) + ' ' +data.toString('hex'));
				if(data[0] == 10 && data.length == 1){
					//clearTimeout(timeout);
				} else {
					try{
						var resp = Report.parse(data);
						console.log("iterator: " + ++i);
						console.log('data: ' + data.toString('hex'))
						socket.removeListener('data', g);
						callback(resp);
					} catch (err) {
						console.log(err)
					}
				}
			}
			socket.on('data', g);
		});
/*		var timeout = setTimeout(function(){
			throw "Acknowledge timeout (1000ms)";
		}, 1000);*/

	}

	this.set = function(fnc,number, setting, data){
	    var request = new Set(fnc, number,setting);
	    this.write(request);
	}

	this.get = function(fnc, number, callback){
		var request = new Get(fnc, number);
	    this.write(request, function(data){
	    	callback(data);
	    });
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