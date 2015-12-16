var Teletask  = require('../teletask'),
		net       = require('net'),
		expect    = require('chai').expect

describe('Keepalive', function(){

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

	it('should should send keepalive', function(done){
		teletask.keepalive();
		server.once("connection", function(sock){
      sock.once("data", function(data) {
				expect(data).to.be.eql(new Buffer([2, 3, 0x0b, 0x10]));
				done();
      });
    });
	});

	it('should keep sending keepalive after interval');

});
