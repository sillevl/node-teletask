var Teletask 	= require('../teletask'),
		net 			= require('net'),
		expect  	= require('chai').expect

describe('Sensor', function(){

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

	it('should get status of temperature sensor 5', function(done){
		teletask.get(Teletask.functions.sensor, 5, function(report){
			expect(report.getTemperature()).to.be.equal(12.3)
			done()
		});
		server.once("connection", function(sock){
			sock.once("data", function(data) {
				sock.write(new Buffer([2, 9, 0x10, 1, 20, 0, 5, 0, 123, 176]))
			})
		})
	})

  it('should get status of temperature sensor 5 in kelvin', function(done){
    teletask.get(Teletask.functions.sensor, 5, function(report){
      expect(report.getTemperature("kelvin")).to.be.equal(12.3 - 273.15)
      done()
    });
    server.once("connection", function(sock){
      sock.once("data", function(data) {
        sock.write(new Buffer([2, 9, 0x10, 1, 20, 0, 5, 0, 123, 176]))
      })
    })
  })

  it('should get status of temperature sensor 5 in fahrenheit', function(done){
    teletask.get(Teletask.functions.sensor, 5, function(report){
      expect(report.getTemperature("fahrenheit")).to.be.equal(54.14)
      done()
    });
    server.once("connection", function(sock){
      sock.once("data", function(data) {
        sock.write(new Buffer([2, 9, 0x10, 1, 20, 0, 5, 0, 123, 176]))
      })
    })
  })

	// it('should get status of relay 21 (which is on)', function(done){
	// 	teletask.get(Teletask.functions.relay, 21, function(report){
	// 		expect(report.fnc.fnc).to.be.equal(Teletask.functions.relay)
	// 		expect(report.number).to.be.equal(21)
	// 		expect(report.value.value).to.be.equal(Teletask.settings.on)
	// 		done()
	// 	});
	// 	server.once("connection", function(sock){
	// 		sock.once("data", function(data) {
	// 			sock.write(new Buffer([2, 9, 0x10, 1, 1, 0, 21, 0, 255, 0x31]))
	// 		})
	// 	})
	// })

})
