const express = require("express");
const app = express();
const path = require('path');
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
// { cors: { origin: "*" } }


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
    app.use(express.static(path.join(__dirname, '../public/')));
});



io.on('connection', (socket) => {
    console.log(`${socket.id} user joined`);

    socket.on('join', (roomId) => {
        let set = new Set(io.sockets.adapter.rooms.get(roomId));
        console.log(set);
        console.log(roomId);

        socket.emit('serverMsg', socket.id);
        if (set.size < 2 && roomId !== null) {
            socket.join(roomId);
            console.log(`A user joined the room ${roomId}`);
            let arr = Array.from(io.sockets.adapter.rooms.get(roomId));
            if (set.size === 1) {
                io.to(roomId).emit('createBoard');
                io.to(arr[0]).emit('on');
                io.to(arr[1]).emit('off');

            }
            else {
                io.to(roomId).emit('waiting');
            }
            console.log(set.size);
        }
        else if (roomId === null) {
            socket.emit('roomError');
        }
        else {
            socket.emit('roomFull');
        }

    })

    socket.on('play', (turn, id, roomId) => {
        socket.broadcast.to(roomId).emit('updateGame', turn, id);
    })

    socket.on('gameState', (clientID, roomId) => {
        let arr = Array.from(io.sockets.adapter.rooms.get(roomId));
        console.log(arr);
        if (clientID == arr[0]) {
            io.to(arr[0]).emit('off');
            io.to(arr[1]).emit('on');
        }
        else {
            io.to(arr[0]).emit('on');
            io.to(arr[1]).emit('off');
        }
    })

    socket.on('restart', (roomId) => {
        socket.broadcast.to(roomId).emit('reset');
    })

    socket.on('boardOnOff', (roomId) => {
        let arr = Array.from(io.sockets.adapter.rooms.get(roomId));
        let changeTurn_luck = Math.round(Math.random() * 100);
        console.log(changeTurn_luck);

        if (changeTurn_luck % 2 === 0) {
            io.to(arr[0]).emit('off');
            io.to(arr[1]).emit('on');
        }
        else {
            io.to(arr[0]).emit('on');
            io.to(arr[1]).emit('off');
        }
    })

    socket.on('win', (element, roomId, sign) => {
        socket.broadcast.to(roomId).emit('winArray', element, sign);
    })

    socket.on('onDraw', (roomId) => {
        socket.broadcast.to(roomId).emit('draw');
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} User Disconnected`);
    });
})















server.listen(3000, () => {
    console.log('listening on PORT :3000');

});