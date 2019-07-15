"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socket = _interopRequireDefault(require("socket.io-client"));

var _axios = _interopRequireDefault(require("axios"));

var _chalk = _interopRequireDefault(require("chalk"));

var _socket2 = _interopRequireDefault(require("socket.io-stream"));

var _events = require("events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Connects to DPM tunnel to expose localhost through a proxy
 */
var log = console.log;

var logPrefix = _chalk["default"].magenta("[Tunnel]");

var connectStates = {
  DEFAULT: 0,
  ERROR: -1,
  CONNECTED: 1
};
var Tunnel = {
  open: function open(_ref) {
    var _ref$remoteProxyUrl = _ref.remoteProxyUrl,
        remoteProxyUrl = _ref$remoteProxyUrl === void 0 ? "" : _ref$remoteProxyUrl,
        _ref$baseUrl = _ref.baseUrl,
        baseUrl = _ref$baseUrl === void 0 ? "http://localhost:3000" : _ref$baseUrl;
    log(_chalk["default"].gray("Connecting to DPM Tunnel")); // ( This is to remove logging spam when connection_error keeps firing from reconnecting )
    // Set connectState to error and it will stop printing out errors after the first one

    var connectState = connectStates.DEFAULT;
    var tunnel = this.tunnel = (0, _socket["default"])("".concat(remoteProxyUrl), {
      secure: true,
      rejectUnauthorized: false
    }).connect();
    tunnel.on("connect", function () {
      connectState = connectStates.CONNECTED;
      log("".concat(_chalk["default"].green("\u2714"), " Connected to Tunnel"));
    });
    tunnel.on("request", function (data) {
      log(_chalk["default"].gray("".concat(new Date().toISOString(), " [GET] ")), baseUrl + data.url);

      function responseStream(response) {
        var stream = _socket2["default"].createStream();

        (0, _socket2["default"])(tunnel).emit("response-".concat(data.requestId), stream, {
          headers: response.headers,
          status: response.status
        });
        return stream;
      }

      (0, _axios["default"])({
        method: "GET",
        baseURL: baseUrl,
        url: data.url,
        responseType: "stream"
      }).then(function (response) {
        var stream = responseStream(response);
        response.data.pipe(stream);
      })["catch"](function (error) {
        console.log("GET error", error);
        var stream = responseStream({
          status: 404
        });
        stream.write("Error: ".concat(error.response.statusText));
        stream.end();
      });
    }); // Print connection states to the terminal

    tunnel.on("disconnect", function () {
      log(logPrefix, _chalk["default"].red("Disconnected from Tunnel, will attempt to reconnect.."));
      connectState = connectStates.ERROR;
    });
    tunnel.on("connect_error", function (error) {
      if (connectState !== -1) {
        log(logPrefix, _chalk["default"].red("Unable to connect to the DPM Tunnel. Retrying.."));
        connectState = connectStates.ERROR;
      }
    });
  },
  close: function close() {
    this.tunnel.close();
  }
};
Object.setPrototypeOf(Tunnel, _events.EventEmitter.prototype);
var _default = Tunnel;
exports["default"] = _default;