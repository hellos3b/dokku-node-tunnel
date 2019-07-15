import { EventEmitter } from "events";
import ss from "socket.io-stream";
import Socket from 'socket.io'
import log from './log'
import chalk from 'chalk'

function Tunnel(socket) {
  EventEmitter.call(this);

  this.socket = socket;

  socket.on("disconnect", () => {
    this.emit("disconnect");
  });
}

Tunnel.prototype.__proto__ = EventEmitter.prototype;

Tunnel.prototype.request = function(url) {
  return new Promise((resolve, reject) => {
    const requestId = Math.floor(Math.random() * 10000);

    ss(this.socket).once(`response-${requestId}`, (stream, data) => {
      resolve({ stream, data });
    });

    this.socket.emit(`request`, { requestId, url });
  });
};

let tunnel = null;

export default {
  listen(server) {
    const io = Socket()

    log(`${chalk.green("\u2714")} Socket listening for connections`);

    io.on("connection", client => {
      const source = client.request.connection.remoteAddress;
      tunnel = new Tunnel(client);

      log(`Tunnel connected; source=${source}`);

      tunnel.on("disconnect", () => {
        log(`Lost connection to ${source}`);
        tunnel = null;
      });
    });

    io.listen(server);
  },

  request(url) {
    if (!tunnel) {
      log(chalk.red(`Error: No active connection`));
      return Promise.reject();
    }

    return tunnel.request(url);
  }
};
