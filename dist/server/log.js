"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function log() {
  var timestamp = _chalk["default"].grey(new Date().toTimeString());

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length) {
    var _console;

    (_console = console).log.apply(_console, [timestamp].concat(args));
  }
}

log.error = function () {
  console.log(_chalk["default"].grey(new Date().toTimeString()), _chalk["default"].red.apply(_chalk["default"], arguments));
};

var _default = log;
exports["default"] = _default;