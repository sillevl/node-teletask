var net = require('net');

var HOST = '192.168.1.5';
var PORT = 55957;


function TeletaskRequest() {
	this.start = 2;
	this.parameters = [];
	this.command = 0;
};

TeletaskRequest.prototype.length = function(){
	return this.parameters.length + 3
};

TeletaskRequest.prototype.checksum = function(){
	var parameterSum = 0;
	if(this.parameters.length > 0){
		parameterSum = this.parameters.reduce(
			function(prev,current){
				return  current + prev;
			}
		);
	}
	return (this.start + this.length() + this.command + parameterSum) % 255;
};

TeletaskRequest.prototype.toString = function(){
	var separator = ',';
	var data = [this.start, this.length(), this.command]
	if (this.parameters.length != 0){
		data.push(this.parameters);
	}
	data.push(this.checksum());
	return data.join(separator) + separator;
	//return "s,8,7,1,1,0,21,103,143,";
};

TeletaskRequest.prototype.toBinary = function(){
	var data = [this.start, this.length(), this.command]
	if (this.parameters.length != 0){
		data.push(this.parameters);
	}
	data.push(this.checksum());
	return new Buffer(data);
};

TeletaskKeepAliveRequest = function(){};
TeletaskKeepAliveRequest.prototype = new TeletaskRequest();
TeletaskKeepAliveRequest.prototype.contstructor = function(){
	this.command = Teletask.commands.keepalive;
}

function Request(command, fnc, number, setting){
 	start = 2;
 	parameters = [];
 	if(command != Teletask.commands.keepalive && command != Teletask.commands.functionlog) parameters.push(1); //central
 	if(fnc) parameters.push(fnc);
 	if(number && command != Teletask.commands.functionlog) parameters.push(0);
 	if(number) parameters.push(number);
 	if(setting) parameters.push(setting);

 	length = function(){
 		return parameters.length + 3;
 	}

 	checksum = function(){
 		parameterSum = 0;
 		if(parameters.length > 0){
	 		parameterSum = parameters.reduce(
	           function(prev,current){
	             return  current + prev;
	           }
	         );
 		}
 		return (start + length() + command + parameterSum) % 255;
 	}

 	this.toString = function(){
 		separator = ',';
 		data = ["s", length(), command , parameters, checksum()];
 		return data.join(separator) + separator;
 		//return "s,8,7,1,1,0,21,103,143,";
 	}
 }

 function Report(raw){
 	centralUnit = 0;
 	fnc = 0;
 	number = 0;
 	errorState = 0; //not used by teletask
 	state = 0;

 	this.length = 0;

 	if (raw[0] != 2) throw "Startbit not correct";
 	length = raw[1];

 }

function Teletask(host, port){
	socket = new net.Socket;
	console.log("Starting NodeJS Teletask API...");
	socket.connect(PORT, HOST, function() {
	    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	});

	socket.on('data', function(data) {
	    console.log('DATA('+data.length+'): ' + data.toString('hex'));
	    //socket.destroy();
	});

	socket.on('close', function() {
	    console.log('Connection closed');
	});

	this.set = function(fnc,number, setting, data){
	    request = new Request(Teletask.commands.set, fnc, number,setting);
	    console.log("SET: " + request.toString());
	    socket.write(request.toString());
	}

	this.get = function(fnc, number){
		request = new Request(Teletask.commands.get, fnc, number, null);
	    console.log("GET: " + request.toString());
	    socket.write(request.toString());
	}

	this.startLog = function(fnc){
		request = new Request(Teletask.commands.functionlog, fnc, true);
		console.log("STARTLOG: " + request.toString());
	    socket.write(request.toString());
	}

	this.keepalive = function(){
		request = new TeletaskKeepAliveRequest();
		//request = new Request(Teletask.commands.keepalive);
		console.log("KEEPALIVE: " + request.toString());
		console.log("KEEPALIVE binary: " + request.toBinary());
	    socket.write(request.toBinary());
	}
}

Teletask.functions = {
	"relay": 1,
	"dimmer": 2,
	"motor": 6,
	"localmood": 8,
	"timedmood": 9,
	"generalmood" : 10,
	"flag": 15,
	"sensor": 20,
	"audio": 31,
	"regime": 14,
	"service": 53,
	"message": 54,
	"condition": 60 
};

Teletask.settings = {
	"on": 255,
	"toggle": 103,
	"off": 0
};

Teletask.commands = {
	"set": 7,
	"get": 6,
	"groupget": 9,
	"functionlog": 3,
	"eventreport": 16,
	"writedisplaymessage": 4,
	"keepalive": 11
}


var teletask = new Teletask(HOST,PORT);

//teletask.get(Teletask.functions.relay, 21);
//teletask.set(Teletask.functions.relay, 21, Teletask.settings.toggle);
//teletask.get(Teletask.functions.relay, 21);
teletask.keepalive();
//teletask.startLog(Teletask.functions.relay);

/*var client = new net.Socket();
console.log("Starting NodeJS Teletask API...");
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    command = Teletask.commands.set;
    fnc = Teletask.functions.relay;
    number = 21;
    setting = Teletask.settings.toggle;
    request = new Request(command, fnc, number,setting);
    console.log(request.toString());
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write(request.toString());

});*/



