
var net = require('net');

var request = require('./lib/request');
var functions = require('./lib/functions');
var settings = require('./lib/settings');

exports.functions = functions;
exports.settings = settings;

exports.connect = function(host, port, callback){
	socket = new net.Socket;
	socket.connect(port, host, function() {
	   	if (typeof callback === "function") {
	    	callback();
	    }
	});

	socket.on('data', function(data) {
		if(data[0] != 10 && data.length != 1){
	    	console.log('DATA('+data.length+'): ' + data.toString('hex'));
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
	    //console.log("SET: " + request.toString());
	    socket.write(request.toBinary());
	}

	this.get = function(fnc, number){
		request = new TeletaskGetRequest(fnc, number);
	    //console.log("GET: " + request.toString());
	    //socket.write(request.toBinary());
	    this.write(request);
	}

	this.logEnable = function(fnc){
		request = new TeletaskLogRequest(fnc, 255);
		//console.log("START LOG: " + request.toString());
	    socket.write(request.toBinary());
	}

	this.logDisable = function(fnc){
		request = new TeletaskLogRequest(fnc, 0);
		//console.log("STOP LOG: " + request.toString());
	    socket.write(request.toBinary());
	}

	this.keepalive = function(){
		request = new TeletaskKeepAliveRequest();
		//console.log("KEEPALIVE: " + request.toString());
	    socket.write(request.toBinary());
	}
}

