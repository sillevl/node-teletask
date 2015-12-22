var net = require('net');

var request = require('./lib/request');
var functions = require('./lib/functions');
var settings = require('./lib/settings');
var Report = require('./lib/report');

var util = require('util');
var EventEmitter = require('events').EventEmitter;

exports.functions = functions;
exports.settings = settings;

var connect = function(host, port, callback){

	EventEmitter.call(this);
	var self = this;

	var keepaliveInterval;

	socket = new net.Socket();
	socket.connect(port, host, function(){
		if(typeof callback === 'function'){	callback(); }
		keepaliveInterval = setInterval(this.keepalive, 60*1000);
	});



	socket.on('data', function(data){
		while(data.length !== 0){
			if(data[0] == 10){  // Acknowledge
				data = data.slice(1);
				self.emit("acknowledge");
				// clear acknowledge timeout
			} else if(data[0] == 0x02) {
				try{
					var report = Report.parse(data);
					self.emit("report", report);
					data = data.slice(report.size+1);
				} catch (err) {
					console.log("Parsing error: " + err);
					var startIndex = data.indexOf(0x02);
					data = data.slice(startIndex);
				}
			} else {
				console.log("next... " + data);
				data = data.slice(1);
			}
		}
	});


	// should all these functions be set by prototype?????

	this.write = function(data, callback){
		socket.write(data.toBinary(), callback);
/*		var timeout = setTimeout(function(){
			throw "Acknowledge timeout (1000ms)";
		}, 1000);*/
	};

	this.set = function(fnc,number, setting, data){
	    var request = new Set(fnc, number,setting);
	    this.write(request);
		};


	this.get = function(fnc, number, callback){
		var request = new Get(fnc, number);
	  this.write(request, function(){
				self.on("report", function(report){
					if (typeof callback === "function" &&
							number == report.number &&
							fnc == functions[report.fnc]
							) {
						callback(report);
					}
				});
			}
		);
	};

	this.groupget = function(fnc, numbers){
		var request = new GroupGet(fnc, numbers);
	    this.write(request);
	};

	this.log = function(fnc, status){
		var state = (typeof status === 'undefined' || status === true) ? settings.on : settings.off;
		var request = new Log(fnc, state);
	    this.write(request);
	};

	this.keepalive = function(){
		var request = new KeepAlive();
	    this.write(request);
	};

	this.close = function(){
		socket.end();
		clearInterval(keepaliveInterval);
	};
};

util.inherits(connect, EventEmitter);

exports.connect = connect;
