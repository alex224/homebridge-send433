# homebridge-send433

Supports radio controlled power switches (433 Mhz) on the HomeBridge Platform and provides a readable callback for getting the "On" State by trying to connect to a network host and port which is controlled by the power switch.

HomeBridge: https://github.com/nfarina/homebridge

433 Mhz send daemon: https://github.com/xkonni/raspberry-remote

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install homebridge-http using: npm install -g git+https://github.com/alex224/homebridge-send433.git
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

Setup you 433 Mhz send daemon (see https://github.com/xkonni/raspberry-remote). The webinterface is not used by this module.

Specify the the host and port on which the daemon is running.
Configure the code (e.g. "11101") and the number of your switch (e.g. "03").

Optional: If you have a network device behind the power switch which offers a listening tcp port you can configure this device and use that avaibility to check if the switch is on or off. This is optional. If not used the module will return the last value set.
Configuration sample:

 ```
"accessories": [
	{
		"accessory": "Send433",
		"name": "Sonos",
		
		"send433host": "homekitpi",
		"send433port": 11337,
		"send433code": "11111",
		"send433number": "03",

		"checkHost": "192.168.1.92",
		"checkPort": "1443"
	}
]
```

# Power state examples
Here a list of devices and their open tcp ports which you can use for config options "checkHost" and "checkPort"
- FireTV: 8008
- Sonos Play1: 1443
- VuSolo2: 80
