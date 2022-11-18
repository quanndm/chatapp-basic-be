const { Server } = require("socket.io");

const initServerSocket = (httpServer)=>{
    const io = new Server(httpServer, { /* options */ });

    io.on("connection", (socket) => {
    // ...
        console.log("connect socket")
    });
    return io
}

module.exports = initServerSocket;