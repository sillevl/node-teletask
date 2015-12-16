
var commands = require('./commands');

Request = function() {
	var start = 2;
	this.parameters = [];
	this.command = 0;

	this.length = function(){
		return this.parameters.length + 3;
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
		var data = ["s", this.length(), this.command];
		if (this.parameters.length !== 0){
			data.push(this.parameters);
		}
		data.push(this.checksum());
		return data.join(separator) + separator;
		//return "s,8,7,1,1,0,21,103,143,";
	};

	this.toBinary = function(){
		var data = [start, this.length(), this.command];
		if (this.parameters.length !== 0){
			this.parameters.map(function(item){
				data.push(item);
			});
		}
		data.push(this.checksum());
		//console.log(data.toString());
		return new Buffer(data);
	};
};


KeepAlive = function(){
	this.command = commands.keepalive;
};
KeepAlive.prototype = new Request();
KeepAlive.prototype.constructor = KeepAlive;

Set = function(fnc,number, setting, data){
	if(typeof number != 'number'){number = parseInt(number);}
	this.command = commands.set;
	this.parameters = [1,fnc,0, number,setting];
};
Set.prototype = new Request();
Set.prototype.constructor = Set;

Get = function(fnc,number){
	if(typeof number != 'number'){number = parseInt(number)}
	this.command = commands.get;
	this.parameters = [1,fnc,0, number];
};
Get.prototype = new Request();
Get.prototype.constructor = Get;

GroupGet = function(fnc,numbers){
	this.command = commands.groupget;
	this.parameters = [1,fnc];
	numbers.forEach(function(number){
		this.parameters.push(0);
		this.parameters.push(number);
	}, this);
};
GroupGet.prototype = new Request();
GroupGet.prototype.constructor = GroupGet;

Log = function(fnc,state){
	this.command = commands.functionlog;
	this.parameters = [fnc,state];
};
Log.prototype = new Request();
Log.prototype.constructor = Log;

exports.KeepAlive = KeepAlive;
exports.Set = Set;
exports.Get = Get;
exports.Log = Log;
