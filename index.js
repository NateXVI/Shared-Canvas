require('dotenv').config();
const path = require('path');
const express = require('express');
const { setgroups } = require('process');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {
		methods: ['GET', 'POST'],
	},
});

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'docs')));

const rooms = {};

io.on('connection', (socket) => {
	socket.leave(socket.id);
	console.log(`new connection ${socket.id}`);
	joinRoom(socket, Number(1).toString());
	sendAllInstructions(socket);

	socket.on('instruction', (msg) => sendInstruction(socket, msg));
	socket.on('joinRoom', (msg) => joinRoom(socket, msg));
});

server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

function sendInstruction(socket, instruction) {
	const room = Array.from(socket.rooms)[0];
	if (!rooms[room]) rooms[room] = [];
	instruction.index = rooms[room].length + 0.5;
	// console.log(instruction);
	rooms[room].push(instruction);
	socket.to(room).emit('instruction', instruction);
}

function sendAllInstructions(socket) {
	const room = Array.from(socket.rooms)[0];
	socket.emit('set instructions', rooms[room]);
}

function joinRoom(socket, room) {
	let rooms = Array.from(socket.rooms);
	rooms.forEach((v) => {
		socket.leave(v);
	});
	if (room == '') return;
	console.log(socket.id, 'joined room', room);
	socket.join(room);

	sendAllInstructions(socket);
}
