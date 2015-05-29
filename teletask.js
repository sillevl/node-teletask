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
	var data = ["s", this.length(), this.command]
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
		this.parameters.map(function(item){
			data.push(item);
		});
	}
	data.push(this.checksum());
	console.log(data.toString());
	return new Buffer(data);
};

TeletaskKeepAliveRequest = function(){
	this.command = Teletask.commands.keepalive;
};
TeletaskKeepAliveRequest.prototype = new TeletaskRequest();
TeletaskKeepAliveRequest.prototype.constructor = TeletaskKeepAliveRequest;

TeletaskSetRequest = function(fnc,number, setting, data){
	this.command = Teletask.commands.set;
	this.parameters = [1,fnc,0, number,setting];
};
TeletaskSetRequest.prototype = new TeletaskRequest();
TeletaskSetRequest.prototype.constructor = TeletaskSetRequest;

TeletaskGetRequest = function(fnc,number){
	this.command = Teletask.commands.get;
	this.parameters = [1,fnc,0, number];
};
TeletaskGetRequest.prototype = new TeletaskRequest();
TeletaskGetRequest.prototype.constructor = TeletaskGetRequest;

TeletaskLogRequest = function(fnc,state){
	this.command = Teletask.commands.functionlog;
	this.parameters = [fnc,state];
};
TeletaskLogRequest.prototype = new TeletaskRequest();
TeletaskLogRequest.prototype.constructor = TeletaskLogRequest;

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
	    request = new TeletaskSetRequest(fnc, number,setting);
	    console.log("SET: " + request.toString());
	    socket.write(request.toBinary());
	}

	this.get = function(fnc, number){
		request = new TeletaskGetRequest(fnc, number);
	    console.log("GET: " + request.toString());
	    socket.write(request.toBinary());
	}

	this.logEnable = function(fnc){
		request = new TeletaskLogRequest(fnc, 255);
		console.log("START LOG: " + request.toString());
	    socket.write(request.toBinary());
	}

	this.logDisable = function(fnc){
		request = new TeletaskLogRequest(fnc, 0);
		console.log("STOP LOG: " + request.toString());
	    socket.write(request.toBinary());
	}

	this.keepalive = function(){
		request = new TeletaskKeepAliveRequest();
		console.log("KEEPALIVE: " + request.toString());
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
	/*setTimeout(function(){
		teletask.get(Teletask.functions.relay, 21);
	}, 500);
	setTimeout(function(){
		teletask.get(Teletask.functions.relay, 21);
	}, 800);
	setTimeout(function(){
		teletask.set(Teletask.functions.relay, 21, Teletask.settings.toggle);
	}, 1000);
	setTimeout(function(){
		teletask.get(Teletask.functions.relay, 21);
	}, 1500);*/
//teletask.get(Teletask.functions.relay, 21);
//teletask.keepalive();
setTimeout(function(){
	teletask.logEnable(Teletask.functions.relay);
}, 500);

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



