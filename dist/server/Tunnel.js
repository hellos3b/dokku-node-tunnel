"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = require("events");

var _socket = _interopRequireDefault(require("socket.io-stream"));

var _socket2 = _interopRequireDefault(require("socket.io"));

var _log = _interopRequireDefault(require("./log"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Tunnel(socket) {
  var _this = this;

  _events.EventEmitter.call(this);

  this.socket = socket;
  socket.on("disconnect", function () {
    _this.emit("disconnect");
  });
}

Tunnel.prototype.__proto__ = _events.EventEmitter.prototype;

Tunnel.prototype.request = function (url) {
  var _this2 = this;

  return new Promise(function (resolve, reject) {
    var requestId = Math.floor(Math.random() * 10000);
    (0, _socket["default"])(_this2.socket).once("response-".concat(requestId), function (stream, data) {
      resolve({
        stream: stream,
        data: data
      });
    });

    _this2.socket.emit("request", {
      requestId: requestId,
      url: url
    });
  });
};

var tunnel = null;
var _default = {
  listen: function listen(server) {
    var io = (0, _socket2["default"])();
    (0, _log["default"])("".concat(_chalk["default"].green("\u2714"), " Socket listening for connections"));
    io.on("connection", function (client) {
      var source = client.request.connection.remoteAddress;
      tunnel = new Tunnel(client);
      (0, _log["default"])("Tunnel connected; source=".concat(source));
      tunnel.on("disconnect", function () {
        (0, _log["default"])("Lost connection to ".concat(source));
        tunnel = null;
      });
    });
    io.listen(server);
  },
  request: function request(url) {
    if (!tunnel) {
      (0, _log["default"])(_chalk["default"].red("Error: No active connection"));
      return Promise.reject();
    }

    return tunnel.request(url);
  }
};
exports["default"] = _default;