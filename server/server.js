require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {
		methods: ['GET', 'POST'],
	},
});

const port = process.env.PORT || 3000;

let roomShapes = new Map();

io.on('connection', (socket) => {
	socket.leave(socket.id);
	console.log(`new connection ${socket.id}`);

	socket.on('join room', (msg) => joinRoom(socket, msg));
	socket.on('add shape', (msg) => addShape(socket, msg));
	socket.on('disconnecting', () => cleanRooms(socket));
	socket.on('clear canvas', () => clearCanvas(socket));
});

function addShape(socket, shape) {
	// console.log(shape);
	const room = Array.from(socket.rooms)[0];
	if (room) {
		socket.to(room).emit('add shape', shape);
		if (roomShapes.get(room) == undefined) roomShapes.set(room, []);
		shapes = roomShapes.get(room);
		shapes.push(shape);
		roomShapes.set(room, shapes);
		// console.log(shapes);
	}
}

function clearCanvas(socket) {
	const room = Array.from(socket.rooms)[0];
	if (room) {
		socket.to(room).emit('clear canvas');
		roomShapes.set(room, []);
	}
}

function joinRoom(socket, room) {
	let rooms = Array.from(socket.rooms);
	rooms.forEach((v) => {
		if (numClientsInRoom(v) == 1 && room != v) {
			roomShapes.delete(v);
			console.log('room deleted', v);
		}
		socket.leave(v);
	});
	if (room == '') return;
	if (!roomShapes.has('room')) roomShapes.set('room', []);
	console.log(socket.id, 'joined room', room);
	socket.join(room);

	if (roomShapes.has(room)) {
		shapes = roomShapes.get(room);
		for (let i in shapes) {
			socket.emit('add shape', shapes[i]);
		}
	}
}

function cleanRooms(socket) {
	socket.rooms.forEach((v) => {
		if (numClientsInRoom(v) == 1 && v !== 'main') {
			roomShapes.delete(v);
			console.log('room deleted', v);
		}
	});
}

function numClientsInRoom(room) {
	try {
		let clients = io.of('/').adapter.rooms.get(room).size;
		return clients;
	} catch (error) {
		return 0;
	}
}

server.listen(port, () => console.log(`Server is listening on port ${port}`));
