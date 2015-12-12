var Teletask  = require('../teletask'),
		net       = require('net'),
		expect    = require('chai').expect

describe('Teletask', function(){

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

	it('create teletask server with default host and port')
	it('create teletask server with default host and custom port')
	it('create teletask server with custom host and default port')
	it('create teletask server with custom host and custom port')

})
