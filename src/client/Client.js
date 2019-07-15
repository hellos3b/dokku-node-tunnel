/**
 * Connects to DPM tunnel to expose localhost through a proxy
 */
const io = require("socket.io-client")
const axios = require("axios")
const chalk = require("chalk")
const ss = require("socket.io-stream")
const EventEmitter = require("events").EventEmitter
const config = require("./config")

const log = console.log
const logPrefix = chalk.magenta("[Tunnel]")
const connectStates = {
  DEFAULT: 0,
  ERROR: -1,
  CONNECTED: 1
}

let Tunnel = {
  open(options) {
    log(chalk.gray("Connecting to DPM Tunnel"))

    // ( This is to remove logging spam when connection_error keeps firing from reconnecting )
    // Set connectState to error and it will stop printing out errors after the first one
    let connectState = connectStates.DEFAULT
    const tunnel = (this.tunnel = io(`${config.remoteProxyUrl}`, {
      secure: true,
      rejectUnauthorized: false
    }).connect())

    tunnel.on("connect", () => {
      connectState = connectStates.CONNECTED
      // Once socket is connected, send username and password to finalize
      log(`${chalk.green("\u2714")} Connected to Tunnel with ID '${options.dpmId}'`)
    })

    tunnel.on("request", data => {
      log(chalk.gray(`${new Date().toISOString()} [GET] `), data.url)

      function responseStream(response) {
        const stream = ss.createStream()

        ss(tunnel).emit(`response-${data.requestId}`, stream, {
          headers: response.headers,
          status: response.status
        })

        return stream
      }

      axios({
        method: "GET",
        baseURL: `http://localhost:${options.port}`,
        url: data.url,
        responseType: "stream"
      })
        .then(response => {
          const stream = responseStream(response)
          response.data.pipe(stream)
        })
        .catch(error => {
          const stream = responseStream({
            status: 404
          })
          stream.write(`Error: ${error.response.statusText}`)
          stream.end()
        })
    })

    // Print connection states to the terminal
    tunnel.on("disconnect", () => {
      log(logPrefix, chalk.red("Disconnected from Tunnel, will attempt to reconnect.."))
      connectState = connectStates.ERROR
    })

    tunnel.on("connect_error", error => {
      if (connectState !== -1) {
        log(logPrefix, chalk.red("Unable to connect to the DPM Tunnel. Retrying.."))
        connectState = connectStates.ERROR
      }
    })
  },

  close() {
    this.tunnel.close()
  }
}

Object.setPrototypeOf(Tunnel, EventEmitter.prototype)

module.exports = Tunnel