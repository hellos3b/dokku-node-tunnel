"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Client = _interopRequireDefault(require("./client/Client"));

var _Server = _interopRequireDefault(require("./server/Server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// export {Server} from './server/Server'
var _default = {
  Client: _Client["default"],
  Server: _Server["default"]
};
exports["default"] = _default;