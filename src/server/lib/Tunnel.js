import { EventEmitter } from 'events'
import ss from 'socket.io-stream'

function Tunnel(socket) {
    EventEmitter.call(this);

    this.socket = socket

    socket.on("disconnect", () => {
        this.emit("disconnect")
    })
}

Tunnel.prototype.__proto__ = EventEmitter.prototype;

Tunnel.prototype.request = function(url) {
    return new Promise( (resolve, reject) => {
        const requestId = Math.floor(Math.random()*10000)

        ss(this.socket).once(`response-${requestId}`, (stream, data) => {
            resolve({stream, data})
        })

        this.socket.emit(`request`, {requestId, url})
    })
}

export default Tunnel