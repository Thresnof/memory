const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});
app.use(express.static(path.join(__dirname, '../')));
const rooms = {};
io.on('connection', (socket) => {
    socket.on('create_room', (data) => {
        const { code } = data;
        rooms[code] = {
            hostId: socket.id,
            players: {}
        };
        socket.join(code);
        console.log(`Pokój ${code} utworzony przez hosta ${socket.id}`);
    });
    socket.on('join_room', (data, callback) => {
        const { code, name } = data;
        if (rooms[code]) {
            socket.join(code);
            rooms[code].players[socket.id] = { name, score: 0, finished: false };
            io.to(rooms[code].hostId).emit('player_joined', {
                playerId: socket.id,
                name: name
            });
            callback({ status: 'ok' });
            console.log(`${name} dołączył do pokoju ${code}`);
        } else {
            callback({ status: 'error', message: 'Nieprawidłowy kod sesji' });
        }
    });
    socket.on('send_board', (data) => {
        const { code, targetPlayerId, board } = data;
        if (targetPlayerId) {
            io.to(targetPlayerId).emit('start_game', { board });
        } else {
            socket.to(code).emit('start_game', { board });
        }
    });
    socket.on('update_score', (data) => {
        const { code, score, hideScore } = data;
        if (rooms[code]) {
            if (rooms[code].players[socket.id]) {
                rooms[code].players[socket.id].score = score;
                rooms[code].players[socket.id].hideScore = hideScore;
            }
            io.to(rooms[code].hostId).emit('player_score', {
                playerId: socket.id,
                score: score,
                hideScore: hideScore
            });
        }
    });
    socket.on('board_finished', (data) => {
        const { code } = data;
        if (rooms[code]) {
            io.to(rooms[code].hostId).emit('player_finished_board', {
                playerId: socket.id
            });
        }
    });
    socket.on('end_game_for_all', (data) => {
        const { code } = data;
        socket.to(code).emit('game_ended_by_host');
    });
    socket.on('disconnect', () => {
        for (const code in rooms) {
            if (rooms[code].hostId === socket.id) {
                socket.to(code).emit('host_disconnected');
                delete rooms[code];
                break;
            }
            if (rooms[code].players[socket.id]) {
                const name = rooms[code].players[socket.id].name;
                delete rooms[code].players[socket.id];
                io.to(rooms[code].hostId).emit('player_left', {
                    playerId: socket.id
                });
                console.log(`Gracz ${name} opuścił pokój ${code}`);
                break;
            }
        }
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serwer wystartował na porcie ${PORT}`);
    console.log(`Hosta z innej sieci zapewnisz udostępniając ten port np. przez ngrok.`);
});