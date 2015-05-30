
var commands = require('./commands');

TeletaskRequest = function() {
	var start = 2;
	this.parameters = [];
	this.command = 0;

	this.length = function(){
		return this.parameters.length + 3
	};

	this.checksum = function(){
		var parameterSum = 0;
		if(this.parameters.length > 0){
			parameterSum = this.parameters.reduce(
				function(prev,current){
					return  current + prev;
				}
			);
		}
		return (start + this.length() + this.command + parameterSum) % 256;
	};

	this.toString = function(){
		var separator = ',';
		var data = ["s", this.length(), this.command]
		if (this.parameters.length != 0){
			data.push(this.parameters);
		}
		data.push(this.checksum());
		return data.join(separator) + separator;
		//return "s,8,7,1,1,0,21,103,143,";
	};

	this.toBinary = function(){
		var data = [start, this.length(), this.command]
		if (this.parameters.length != 0){
			this.parameters.map(function(item){
				data.push(item);
			});
		}
		data.push(this.checksum());
		//console.log(data.toString());
		return new Buffer(data);
	};
};
exports.TeletaskRequest = TeletaskRequest;



TeletaskKeepAliveRequest = function(){
	this.command = commands.keepalive;
};
TeletaskKeepAliveRequest.prototype = new TeletaskRequest();
TeletaskKeepAliveRequest.prototype.constructor = TeletaskKeepAliveRequest;

TeletaskSetRequest = function(fnc,number, setting, data){
	this.command = commands.set;
	this.parameters = [1,fnc,0, number,setting];
};
TeletaskSetRequest.prototype = new TeletaskRequest();
TeletaskSetRequest.prototype.constructor = TeletaskSetRequest;

TeletaskGetRequest = function(fnc,number){
	this.command = commands.get;
	this.parameters = [1,fnc,0, number];
};
TeletaskGetRequest.prototype = new TeletaskRequest();
TeletaskGetRequest.prototype.constructor = TeletaskGetRequest;

TeletaskLogRequest = function(fnc,state){
	this.command = commands.functionlog;
	this.parameters = [fnc,state];
};
TeletaskLogRequest.prototype = new TeletaskRequest();
TeletaskLogRequest.prototype.constructor = TeletaskLogRequest;

exports.TeletaskKeepAliveRequest = TeletaskKeepAliveRequest;
exports.TeletaskSetRequest = TeletaskSetRequest;
exports.TeletaskGetRequest = TeletaskGetRequest;
exports.TeletaskLogRequest = TeletaskLogRequest;