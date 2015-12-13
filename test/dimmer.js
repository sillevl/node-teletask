var Teletask 	= require('../teletask'),
		net 			= require('net'),
		expect  	= require('chai').expect

describe('Dimmers', function(){

	var HOST = 'localhost';
	var PORT = 55957;

	var teletask;
	var server;

	beforeEach(function(done){
		teletask = new Teletask.connect(HOST,PORT);
		server = net.createServer().listen(PORT,done);
	})

	afterEach(function() {
		server.close()
	})

	describe('set a dimmer', function(){
		it('should set dimmer 1 at 0%', function(done){
			teletask.set(Teletask.functions.dimmer, 1, 0);
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					expect(data).to.be.eql(new Buffer([2, 8, 7, 1, 2, 0, 1, 0, 21]));
					done();
				})
			})
		});
		it('should set dimmer 1 at 100%', function(done){
			teletask.set(Teletask.functions.dimmer, 1, 100);
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					expect(data).to.be.eql(new Buffer([2, 8, 7, 1, 2, 0, 1, 100, 121]));
					done();
				})
			})
		});
		it('should set dimmer 1 at 33%', function(done){
			teletask.set(Teletask.functions.dimmer, 1, 33);
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					expect(data).to.be.eql(new Buffer([2, 8, 7, 1, 2, 0, 1, 33, 54]));
					done();
				})
			})
		});
		it('should set dimmer 7 at 33%', function(done){
			teletask.set(Teletask.functions.dimmer, 7, 33);
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					expect(data).to.be.eql(new Buffer([2, 8, 7, 1, 2, 0, 7, 33, 60]));
					done();
				})
			})
		});
	})

	describe('get the status of a dimmer', function(){
		it('should get status of dimmer 1 (which is at 0%)', function(done){
			teletask.get(Teletask.functions.dimmer, 1, function(report){
				expect(report.status).to.be.equal(0);
				expect(report.number).to.be.equal(1);
				done()
			});
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					sock.write(new Buffer([ 2, 9, 16, 1, 2, 0, 1, 0, 0, 31 ]))
				})
			})
		});
		it('should get status of dimmer 1 (which is 100%)', function(done){
			teletask.get(Teletask.functions.dimmer, 1, function(report){
				expect(report.status).to.be.equal(100);
				expect(report.number).to.be.equal(1);
				done()
			});
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					sock.write(new Buffer([ 2, 9, 16, 1, 2, 0, 1, 0, 100, 131 ]))
				})
			})
		});
		it('should get status of dimmer 1 (which is 33%)', function(done){
			teletask.get(Teletask.functions.dimmer, 1, function(report){
				expect(report.status).to.be.equal(33);
				expect(report.number).to.be.equal(1);
				done()
			});
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					sock.write(new Buffer([ 2, 9, 16, 1, 2, 0, 1, 0, 33, 64 ]))
				})
			})
		});
		it('should get status of dimmer 7 (which is 33%)', function(done){
			teletask.get(Teletask.functions.dimmer, 7, function(report){
				expect(report.status).to.be.equal(33);
				expect(report.number).to.be.equal(7);
				done()
			});
			server.once("connection", function(sock){
				sock.once("data", function(data) {
					sock.write(new Buffer([ 2, 9, 16, 1, 2, 0, 7, 0, 33, 70 ]))
				})
			})
		});
	})
})
