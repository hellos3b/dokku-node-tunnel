import chalk from 'chalk'
import Tunnel from './tunnel'
import Socket from 'socket.io'

import log from '../log'

const io = Socket()

let tunnel = null

export default {

    listen(server) {
        log(`${chalk.green("\u2714")} Socket listening for connections`)

        io.on("connection", (client) => {
            const source = client.request.connection.remoteAddress
            tunnel = new Tunnel(client)

            log(`Tunnel connected; source=${source}`)

            tunnel.on('disconnect', () => {
                log(`Lost connection to ${source}`)
                tunnel = null
            })
        })
      
        io.listen(server);        
    },

    request(url) {
        console.log(url)
        if (!tunnel) {
            log(chalk.red(`No active connection`))
            return Promise.reject()
        }
        
        return tunnel.request(url)
    }
}