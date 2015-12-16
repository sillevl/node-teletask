var Teletask 	= require('../teletask'),
		net 			= require('net'),
		expect  	= require('chai').expect;

describe('Relays', function(){

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

	describe('set a relay', function(){
		it('should toggle the status of relay 21', function(done){
			teletask.set(Teletask.functions.relay, 21, Teletask.settings.toggle);
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					expect(data).to.be.eql(new Buffer([2, 8, 7, 1, 1, 0, 21, 103, 0x8f]));
					done();
				});
			});
		});

		it('should set relay 21 on', function(done){
			teletask.set(Teletask.functions.relay, 21, Teletask.settings.on);
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					expect(data).to.be.eql(new Buffer([2, 8, 7, 1,1, 0, 21, 255, 0x27]));
					done();
				});
			});
		});

		it('should set relay 21 off', function(done){
			teletask.set(Teletask.functions.relay, 21, Teletask.settings.off);
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					expect(data).to.be.eql(new Buffer([2, 8, 7, 1, 1, 0, 21, 0, 0x28]));
					done();
				});
			});
		});

		it('should set relay 1 off', function(done){
			teletask.set(Teletask.functions.relay, 1, Teletask.settings.off);
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					expect(data).to.be.eql(new Buffer([2, 8, 7, 1, 1, 0, 1, 0, 0x14]));
					sock.write(new Buffer([0x0a]));
					done();
				});
			});
		});
	});

	describe('get the status of a relay', function(){
		it('should get status of relay 21 (which is off)', function(done){
			teletask.get(Teletask.functions.relay, 21, function(report){
				expect(report.status).to.be.equal(Teletask.settings.getKey(Teletask.settings.off));
				done();
			});
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					sock.write(new Buffer([2, 9, 0x10, 1, 1, 0, 21, 0, 0, 0x32]));
				});
			});
		});

		it('should get status of relay 21 (which is on)', function(done){
			teletask.get(Teletask.functions.relay, 21, function(report){
				expect(report.fnc).to.be.equal(Teletask.functions.getKey(Teletask.functions.relay));
				expect(report.number).to.be.equal(21);
				expect(report.status).to.be.equal(Teletask.settings.getKey(Teletask.settings.on));
				done();
			});
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					sock.write(new Buffer([2, 9, 0x10, 1, 1, 0, 21, 0, 255, 0x31]));
				});
			});
		});
	});
});
