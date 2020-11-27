require("dotenv").config();
const path = require("path");
const express = require("express");
const { setgroups } = require("process");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		methods: ["GET", "POST"],
	},
});

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "docs")));

let artists = [];
let steps = [];

io.on("connection", (socket) => {
	console.log(`New connection`, socket.id);
	artists.push({
		id: socket.id,
	});
	socket.emit("canvas init", steps);
	socket.on("broadcast", (msg) => {
		console.log(msg);
		socket.broadcast.emit("broadcast", msg);
	});
	socket.on("stroke", (msg) => {
		socket.broadcast.emit("stroke", msg);
		steps.push(msg);
		console.log(steps.length);
		// console.log(msg);
	});
	socket.on("delete canvas", () => {
		io.emit("delete canvas");
		steps = [];
	});
});

server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

function Room(key, host) {
	this.key = key;
	this.host = host;
}
