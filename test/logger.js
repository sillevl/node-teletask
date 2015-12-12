var Teletask  = require('../teletask'),
		net       = require('net'),
		expect    = require('chai').expect

describe('Logger', function(){

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

	it('should enable logger for relay events')
	it('should enable logger all events')
	it('should receive events for relay logging')
	it('should receive all events')
  
})
