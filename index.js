var Service, Characteristic;

const send433 = require("./send433");
const ping = require('./hostportconnectable');

module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-send433", "Send433", Send433Accessory);
}

function Send433Accessory(log, config) {
	this.log = log;
	
	this.name = config["name"];

	//required
	this.send433host = config["send433host"];
	this.send433port = config["send433port"] || 11337;
	this.send433code = config["send433code"];
	this.send433number = config["send433number"];
	//optional
	this.checkHost = config["checkHost"];
	this.checkPort = config["checkPort"];

	//internal
	this.lastState = null;
}

Send433Accessory.prototype = {

	setPowerState: function (powerOn, callback) {
		if (!this.send433host) {
			callback(new Error("No host defined on which the send daemon is running (send433host)."));
		}
		if (!this.send433port) {
			callback(new Error("No port defined on which the send daemon is running (send433port)."));
		}
		if (!this.send433code) {
			callback(new Error("No address defined for switch (send433code)."));
		}
		if (!this.send433number) {
			callback(new Error("No number of switch defined (send433number)."));
		}

		var me = this;
		me.log('Power state change request: ', powerOn);

		send433.send([{ host: this.send433host, port: this.send433port }], this.send433code, this.send433number, powerOn, function (status) {
			me.log('Send433 result callback: ', status);
			me.lastState = powerOn;
			callback();
		});
	},

	getPowerState: function (callback) {
		var me = this;
		//Using host and port and try to connect
		if (this.checkHost && this.checkPort) {
			
			var callbackCalled = false;

			me.log('Get power state request, try to connect to ' + this.checkHost + ":" + this.checkPort);
			ping.checkHostIsReachable(this.checkHost, this.checkPort, function(result) {
				me.log('Connect result: ' + result);
				me.lastState = result;
				if (!callbackCalled) {
                	callback(null, result ? 1 : 0);
				} else {
					me.switchService.setCharacteristic(Characteristic.On, result ? 1 : 0);
				}
            });
			
			//First return the cached state if available
			if (me.lastState != null) {
				me.log('returning last known value: ' + me.lastState);
				callback(null, me.lastState);
				callbackCalled = true;
			}

		} else {
			//Use last state
			me.log('Get power state request, returning last known state ' + this.lastState);
			callback(null, this.lastState);
		}
	},

	identify: function (callback) {
		this.log("Identify requested!");
		callback();
	},

	getServices: function () {
		var informationService = new Service.AccessoryInformation();
		informationService
			.setCharacteristic(Characteristic.Manufacturer, "alex224")
			.setCharacteristic(Characteristic.Model, "433Mhz Send Module")
			.setCharacteristic(Characteristic.SerialNumber, "Send433 Serial Number");

		this.switchService = new Service.Switch(this.name);
		this.switchService
			.getCharacteristic(Characteristic.On)
			.on('get', this.getPowerState.bind(this))
			.on('set', this.setPowerState.bind(this));
		return [informationService, this.switchService];
	}
};