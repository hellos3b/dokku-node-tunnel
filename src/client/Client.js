/**
 * Connects to DPM tunnel to expose localhost through a proxy
 */
import io  from "socket.io-client"
import axios from "axios"
import chalk from "chalk"
import ss from "socket.io-stream"
import {EventEmitter} from "events"

const log = console.log
const logPrefix = chalk.magenta("[Tunnel]")
const connectStates = {
  DEFAULT: 0,
  ERROR: -1,
  CONNECTED: 1
}

let Tunnel = {
  open({
    remoteProxyUrl="",
    baseUrl="http://localhost:3000"
  }) {
    log(chalk.gray("Connecting to DPM Tunnel"))

    // ( This is to remove logging spam when connection_error keeps firing from reconnecting )
    // Set connectState to error and it will stop printing out errors after the first one
    let connectState = connectStates.DEFAULT
    const tunnel = (this.tunnel = io(`${remoteProxyUrl}`, {
      secure: true,
      rejectUnauthorized: false
    }).connect())

    tunnel.on("connect", () => {
      connectState = connectStates.CONNECTED

      log(`${chalk.green("\u2714")} Connected to Tunnel`)
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
        baseURL: baseUrl,
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

export default Tunnel