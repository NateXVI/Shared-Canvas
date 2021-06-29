require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	// cors: {
	// 	methods: ['GET', 'POST'],
	// },
});
const cors = require('cors');

app.use(cors());

const port = process.env.PORT || 3000;
const rooms = {};

io.on('connection', (socket) => {
	socket.leave(socket.id);
	console.log(`new connection ${socket.id}`);
	joinRoom(socket, Number(1).toString());
	sendAllInstructions(socket);

	socket.on('instruction', (msg) => sendInstruction(socket, msg));
	socket.on('joinRoom', (msg) => joinRoom(socket, msg));
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

// function cleanRooms(socket) {
// 	socket.rooms.forEach((v) => {
// 		if (numClientsInRoom(v) == 1 && v !== 'main') {
// 			roomShapes.delete(v);
// 			console.log('room deleted', v);
// 		}
// 	});
// }

// function numClientsInRoom(room) {
// 	try {
// 		let clients = io.of('/').adapter.rooms.get(room).size;
// 		return clients;
// 	} catch (error) {
// 		return 0;
// 	}
// }

server.listen(port, () => console.log(`Server is listening on port ${port}`));
