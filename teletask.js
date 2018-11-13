const net = require('net')

const request = require('./lib/request')
const functions = require('./lib/functions')
const settings = require('./lib/settings')
const Report = require('./lib/report')

const util = require('util')
const EventEmitter = require('events').EventEmitter

exports.functions = functions
exports.settings = settings

const connect = function (host, port, callback) {
  EventEmitter.call(this)
  const self = this

  let keepaliveInterval

  const socket = new net.Socket()
  socket.connect(
    port,
    host,
    function () {
      if (typeof callback === 'function') {
        callback()
      }
      keepaliveInterval = setInterval(self.keepalive, 1000)
    }
  )

  socket.on('data', function (data) {
    while (data.length !== 0) {
      if (data[0] == 10) {
        // Acknowledge
        data = data.slice(1)
        self.emit('acknowledge')
        // clear acknowledge timeout
      } else {
        try {
          const report = Report.parse(data)
          self.emit('report', report)
          data = data.slice(report.size + 1)
        } catch (err) {
          console.log('Parsing error: ' + err)
          data = data.slice(1)
        }
      }
    }
  })

  // should all these functions be set by prototype?????

  this.write = function (data, callback) {
    socket.write(data.toBinary(), callback)
    // var timeout = setTimeout(function () {
    //   throw 'Acknowledge timeout (1000ms)'
    // }, 1000)
  }

  this.set = function (fnc, number, setting, data) {
    const request = new Set(fnc, number, setting)
    this.write(request)
  }

  this.get = function (fnc, number, callback) {
    const request = new Get(fnc, number)
    this.write(request, function () {
      const reportCallback = function (report) {
        if (
          typeof callback === 'function' &&
          number == report.number &&
          fnc == functions[report.fnc]
        ) {
          callback(report)
          self.removeListener('report', reportCallback)
        }
      }
      self.on('report', reportCallback)
    })
  }

  this.groupget = function (fnc, numbers) {
    const request = new GroupGet(fnc, numbers)
    this.write(request)
  }

  this.log = function (fnc, status) {
    const state =
      typeof status === 'undefined' || status === true
        ? settings.on
        : settings.off
    const request = new Log(fnc, state)
    this.write(request)
  }

  this.keepalive = function () {
    const request = new KeepAlive()
    self.write(request)
  }

  this.close = function () {
    socket.end()
    clearInterval(keepaliveInterval)
  }
}

util.inherits(connect, EventEmitter)

exports.connect = connect
