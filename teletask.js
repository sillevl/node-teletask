var net = require('net');

var HOST = '192.168.1.5';
var PORT = 55957;

var client = new net.Socket();
console.log("Starting NodeJS Teletask API...");
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    command = 7;
    funct = 1;
    number = 21;
    setting = 103;
    request = new Request(command, funct, number,setting);
    console.log(request.toString());
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write(request.toString());

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    
    console.log('DATA: ' + data);
    // Close the client socket completely
    client.destroy();
    
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});

 var Request = function(command, funct, number, setting){
 	start = 2;
 	parameters = [];
 	parameters.push(1); //central
 	parameters.push(funct);
 	parameters.push(0);
 	parameters.push(number);
 	parameters.push(setting);

 	length = function(){
 		return parameters.length + 3;
 	}

 	checksum = function(){
 		parameterSum = parameters.reduce(
           function(prev,current){
             return  current + prev;
           }
         );
 		return (start + length() + command + parameterSum) % 255;
 	}

 	this.toString = function(){
 		separator = ',';
 		data = ["s", length(), command , parameters, checksum()];
 		return data.join(separator) + separator;
 		//return "s,8,7,1,1,0,21,103,143,";
 	}
 }