"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = exports.start = void 0;

var _Client = _interopRequireDefault(require("./client/Client"));

var _Server = require("./server/Server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// export {Server} from './server/Server'
var start = function start(options) {
  return _Server.Server.start(options);
};

exports.start = start;

var connect = function connect(options) {
  return _Client["default"].open(options);
};

exports.connect = connect;