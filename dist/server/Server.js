"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Server = void 0;

var _express = _interopRequireDefault(require("express"));

var _chalk = _interopRequireDefault(require("chalk"));

var _Tunnel = _interopRequireDefault(require("./Tunnel"));

var _log = _interopRequireDefault(require("./log"));

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Server = {
  start: function start(_ref) {
    var port = _ref.port;
    var PORT = port;
    var app = (0, _express["default"])();
    app.get("/*", function (req, res) {
      var url = req.originalUrl;
      (0, _log["default"])("[GET] ".concat(url));

      _Tunnel["default"].request(url).then(function (_ref2) {
        var stream = _ref2.stream,
            data = _ref2.data;
        res.writeHead(data.status, data.headers);
        stream.pipe(res);
      })["catch"](function () {
        res.status(404).send("Error: No Active Tunnel Connection");
      });
    });

    var server = _http["default"].createServer(app);

    server.listen(PORT, function () {
      return (0, _log["default"])("".concat(_chalk["default"].green("\u2714"), " Server listening on port ").concat(PORT, "!"));
    });

    _Tunnel["default"].listen(server);
  }
};
exports.Server = Server;