var net = require('net');

var request = require('./request');
var functions = require('./functions');
var settings = require('./settings');

exports.functions = functions;
exports.settings = settings;

exports.connect = function(host, port, callback){
	socket = new net.Socket;
	console.log("Starting NodeJS Teletask API... on " + host + " at port " + port);
	socket.connect(port, host, function() {
	    console.log('connected');
	    callback();
	});

	socket.on('data', function(data) {
	    console.log('DATA('+data.length+'): ' + data.toString('hex'));
	});

	socket.on('close', function() {
	    console.log('Connection closed');
	});

	socket.on('error', function(err){
		console.log(err);
	});

	this.set = function(fnc,number, setting, data){
	    request = new TeletaskSetRequest(fnc, number,setting);
	    //console.log("SET: " + request.toString());
	    socket.write(request.toBinary());
	}

	this.get = function(fnc, number){
		request = new TeletaskGetRequest(fnc, number);
	    //console.log("GET: " + request.toString());
	    socket.write(request.toBinary());
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