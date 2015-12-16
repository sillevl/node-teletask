var Teletask  = require('../teletask'),
		net       = require('net'),
		expect    = require('chai').expect;

describe('Logger', function(){

	var HOST = 'localhost';
	var PORT = 55957;

	var teletask;
	var server;

	beforeEach(function(done){
		teletask = new Teletask.connect(HOST,PORT);
		server = net.createServer().listen(PORT,done);
	});

	afterEach(function() {
		server.close();
	});

	it('should enable logger for relay events', function(done){
		teletask.log(Teletask.functions.relay, true);
		server.once("connection", function(sock){
			sock.once("data", function(data) {
				expect(data).to.be.eql(new Buffer([2, 5, 3, 1, 255, 10]));
				done();
			});
		});
	});
	it('should enable logger for dimmer events', function(done){
		teletask.log(Teletask.functions.dimmer, true);
		server.once("connection", function(sock){
			sock.once("data", function(data) {
				expect(data).to.be.eql(new Buffer([2, 5, 3, 2, 255, 11]));
				done();
			});
		});
	});
	it('should enable logger (with default argument) for dimmer events', function(done){
		teletask.log(Teletask.functions.dimmer);
		server.once("connection", function(sock){
			sock.once("data", function(data) {
				expect(data).to.be.eql(new Buffer([2, 5, 3, 2, 255, 11]));
				done();
			});
		});
	});
	it('should disable logger for relay events', function(done){
		teletask.log(Teletask.functions.relay, false);
		server.once("connection", function(sock){
			sock.once("data", function(data) {
				expect(data).to.be.eql(new Buffer([2, 5, 3, 1, 0, 11]));
				done();
			});
		});
	});
	it('should disable logger for dimmer events', function(done){
		teletask.log(Teletask.functions.dimmer, false);
		server.once("connection", function(sock){
			sock.once("data", function(data) {
				expect(data).to.be.eql(new Buffer([2, 5, 3, 2, 0, 12]));
				done();
			});
		});
	});
});
