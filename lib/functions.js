var utils = require('./utils');

module.exports = {
	relay: 1,
	dimmer: 2,
	motor: 6,
	localmood: 8,
	timedmood: 9,
	generalmood : 10,
	flag: 15,
	sensor: 20,
	audio: 31,
	regime: 14,
	service: 53,
	message: 54,
	condition: 60,

	getKey: utils.getKey
};