// export {Server} from './server/Server'

import Client from './client/Client'
import Server from './server/Server'

console.log("Client", Client)

export default {
  start(options) {
    Server.start(options)
  },
  connect(options) {
    Client.open(options)
  }
}