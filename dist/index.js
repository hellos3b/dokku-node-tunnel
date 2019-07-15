"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Client = _interopRequireDefault(require("./client/Client"));

var _Server = _interopRequireDefault(require("./server/Server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// export {Server} from './server/Server'
console.log("Client", _Client["default"]);
var _default = {
  start: function start(options) {
    _Server["default"].start(options);
  },
  connect: function connect(options) {
    _Client["default"].open(options);
  }
};
exports["default"] = _default;