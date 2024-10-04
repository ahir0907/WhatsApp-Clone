const express = require('express');
const path = require("path");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(patj.join(__dirname, "public")));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-user-joined', (name) => {
        users.push(name); // Store the user in the users array
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); // Notify other users about the new user
    });

    socket.on('send', (message) =>{
        socket.broadcast.emit('receive', {message:message, name:users[socket.id]});
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            socket.broadcast.emit('user-disconnected', name); // Notify others about the disconnected user
            delete users[socket.id]; // Remove the user from the list
        }
        console.log(`${name} disconnected`);
    });
});

server.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});
