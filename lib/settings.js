var utils = require('./utils');

module.exports = {
	// relays
	on: 255,
	toggle: 103,
	off: 0,

	//temperature presets:
	day: 26,
	night: 25,
	standby: 93,

	temperature_speed: {
		slow: 97,
		medium: 98,
		high: 99,
		auto: 89
	},

	temperature_mode: {
		auto: 94,
		heat: 95,
		cool: 96,
		ventilate: 105,
		stop: 106,
		heatplus: 107,
	},


	getKey: utils.getKey
}
