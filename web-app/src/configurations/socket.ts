import { io, Socket } from "socket.io-client"
import { tokenService } from "@/services/token.service"

const SOCKET_URL = "http://localhost:8099"

class SocketConfiguration {
  private socket: Socket | null = null

  getSocket(): Socket {
    if (!this.socket) {
      const token = tokenService.getToken()
      this.socket = io(SOCKET_URL, {
        query: { token: token || "" },
        autoConnect: false,
      })

      this.socket.on("connect", () => {
        // console.log("Socket.io connected")
      })

      this.socket.on("disconnect", () => {
        // console.log("Socket.io disconnected")
      })

      this.socket.on("connect_error", (error) => {
        // Suppress connection error logs as requested
        // console.error("Socket.io connection error:", error)
      })
    }
    return this.socket
  }

  connect() {
    const socket = this.getSocket()
    if (!socket.connected) {
      socket.connect()
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const socketConfig = new SocketConfiguration()
