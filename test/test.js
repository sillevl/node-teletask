var assert = require("assert")
var Teletask = require('../teletask');

var HOST = '192.168.1.5';
var PORT = 55957;

describe('Teletask', function(){

	var teletask = new Teletask.connect(HOST,PORT);
	console.log("Starting NodeJS Teletask API... on " + HOST + " at port " + PORT);

  	describe('get', function(){
    	it('get status of relay 21', function(){
    		teletask.get(Teletask.functions.relay, 21);
      		//assert.equal(-1, [1,2,3].indexOf(5));
      		//assert.equal(-1, [1,2,3].indexOf(0));
    	})
  	})

  	describe('set', function(){
  		it('toggle the status of relay 21', function(){
  			//teletask.get(Teletask.functions.relay, 21);
  			teletask.set(Teletask.functions.relay, 21, Teletask.settings.toggle);
  			//teletask.get(Teletask.functions.relay, 21);
  		})
  	})

  	describe('logger', function(){
  		it('toggle the status of relay 21', function(){
  			teletask.logEnable(Teletask.functions.relay);
  			teletask.set(Teletask.functions.relay, 21, Teletask.settings.toggle);
  		})
  	})

  	describe('keepalive', function(){
  		it('toggle the status of relay 21', function(){
  			teletask.keepalive();
  		})
  	})
})



/*
var HOST = '192.168.1.5';
var PORT = 55957;

var Teletask = require('../teletask');

var teletask = new Teletask.connect(HOST,PORT, function(){

	//teletask.get(Teletask.functions.relay, 21);
	setTimeout(function(){
		teletask.get(Teletask.functions.relay, 21);
	}, 500);
	setTimeout(function(){
		teletask.get(Teletask.functions.relay, 21);
	}, 800);
	setTimeout(function(){
		teletask.set(Teletask.functions.relay, 21, Teletask.settings.toggle);
	}, 1000);
	setTimeout(function(){
		teletask.get(Teletask.functions.relay, 21);
	}, 1500);
	//teletask.get(Teletask.functions.relay, 21);
	teletask.keepalive();
	setTimeout(function(){
		teletask.logEnable(Teletask.functions.relay);
	}, 500);


});*/