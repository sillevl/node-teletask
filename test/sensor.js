var Teletask 	= require('../teletask'),
		net 			= require('net'),
		expect  	= require('chai').expect

describe('Sensors', function(){

	var HOST = 'localhost';
	var PORT = 55957;

	var teletask;
	var server;

	beforeEach(function(done){
		teletask = new Teletask.connect(HOST,PORT);
		server = net.createServer().listen(PORT,done);
		server.once("connection", function(sock){
			sock.once("data", function(data) {
				sock.write(new Buffer([2,26,16,1,20,0,5,0,11,49,11,119,11,114,11,14,25,0,94,89,255,0,9,0,11,214,83]));
			});
		});
	});

	afterEach(function() {
		server.close();
	});

	it('should get temperature of sensor 5', function(done){
		teletask.get(Teletask.functions.sensor, 5, function(report){
			expect(report.getTemperature()).to.be.equal(13.5);
			expect(report.temperature).to.be.equal(13.5);
			done();
		});
	});

  it('should get temperature of sensor 5 in kelvin', function(done){
    teletask.get(Teletask.functions.sensor, 5, function(report){
      expect(report.getTemperature("kelvin")).to.be.equal(13.5 + 273);
      done();
    });
  });

  it('should get temperature of sensor 5 in fahrenheit', function(done){
    teletask.get(Teletask.functions.sensor, 5, function(report){
      expect(report.getTemperature("fahrenheit")).to.be.equal(56.3);
      done();
    });
  });

	describe('Thermostate', function(){
		it('should get day temperature', function(done){
			teletask.get(Teletask.functions.sensor, 5, function(report){
				expect(report.thermostate.day).to.be.equal(20);
				done();
			});
		});

		it('should get night temperature', function(done){
			teletask.get(Teletask.functions.sensor, 5, function(report){
				expect(report.thermostate.night).to.be.equal(10);
				done();
			});
		});

		it('should get standby preset', function(done){
			teletask.get(Teletask.functions.sensor, 5, function(report){
				expect(report.thermostate.standby_preset).to.be.equal(2.5);
				done();
			});
		});

		it('should get mode', function(done){
			teletask.get(Teletask.functions.sensor, 5, function(report){
				expect(report.thermostate.mode).to.be.equal('auto');
				done();
			});
		});

		it('should get day speed', function(done){
			teletask.get(Teletask.functions.sensor, 5, function(report){
				expect(report.thermostate.speed).to.be.equal('auto');
				done();
			});
		});
	});
});
