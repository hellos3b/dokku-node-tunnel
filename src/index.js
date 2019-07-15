// export {Server} from './server/Server'

import Client from './client/Client'
import Server from './server/Server'

export const start = (options) => Server.start(options)
export const connect = options => Client.open(options)