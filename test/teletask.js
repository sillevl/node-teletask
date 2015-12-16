var Teletask  = require('../teletask'),
		net       = require('net'),
		expect    = require('chai').expect;

describe('Teletask', function(){

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

	it('create teletask server with default host and port');
	it('create teletask server with default host and custom port');
	it('create teletask server with custom host and default port');
	it('create teletask server with custom host and custom port');

	it('should receive events', function(done){
		teletask.on("report", function(report){
			expect(report.fnc).to.be.equal(Teletask.functions.getKey(Teletask.functions.relay));
			expect(report.number).to.be.equal(21);
			done();
		});
		teletask.get(Teletask.functions.relay, 21);
		server.once("connection", function(sock){
			sock.once("data", function(data) {
				sock.write(new Buffer([2, 9, 0x10, 1, 1, 0, 21, 0, 255, 0x31]));
			});
		});
	});
});
