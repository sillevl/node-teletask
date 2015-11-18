NodeJS Teletask API
===

[![Build Status](https://travis-ci.org/sillevl/node-teletask.svg)](https://travis-ci.org/sillevl/node-teletask)

__node-teletaks__ is a library communicating with a Teletaks domotics system using Node.js.

## installation

```
$ npm install node-teletask --save
```

## Basic Example

The following example creates a pololu object and communicates with the pololu gateway using the CoAP protocol:

```js
var Teletask = require('node-teletask');

var HOST = '127.0.0.1';
var PORT = 55957;

var teletask = new Teletask.connect(HOST,PORT);

teletask.set(Teletask.functions.relay, 21, Teletask.settings.toggle);

// get the status of relay with number 21
teletask.get(Teletask.functions.relay, 21, function(report){
  console.log("Relay 21 is " + report.value.name);
});

// send a keepalive to keep the connection open over a longer time
teletask.keepalive();

```

## API

Connection:

  * connect()

Teletaks api:

  * get()
  * set()
  * groupset()
  * logEnable()
  * logDisable()
  * keepalive()

objects:

  * report object
  * functions
  * settings

### connect([host],[port])
connect to a Teletask central, using a port and host (or ip address) and returns a Teletask object.

### get(function, number, callback)
[TODO]

### set(function, number, data)
[TODO]

### keepalive()
[TODO]

### groupset()
not implemented yet

### log()
not implemented yet

### Teletask.Report
[TODO]

### Teletask.functions
[TODO]

### Teletask.Settings
[TODO]
