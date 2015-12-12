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
		it('should set dimmer 1 at 0%');
		it('should set dimmer 1 at 100%');
		it('should set dimmer 1 at 33%');
		it('should set dimmer 7 at 33%');
	})

	describe('get the status of a dimmer', function(){
		it('should get status of dimmer 1 (which is at 0%)');
		it('should get status of dimmer 1 (which is 100%)');
		it('should get status of dimmer 1 (which is 33%)');
		it('should get status of dimmer 7 (which is 33%)');
	})
})
