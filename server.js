require("dotenv").config();
const path = require("path");
const express = require("express");
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
let actions = [];

io.on("connection", (socket) => {
	console.log(`New connection ${socket.id}`);
	// socket.emit("sync", actions);
	sync();

	socket.on("draw action", (msg) => {
		actions.push(msg);
		socket.emit("sync", actions);
		socket.broadcast.emit("draw action", msg);
	});

	socket.on("undo", () => {
		actions.pop();
		sync();
	});

	socket.on("delete", () => {
		let l = actions.length;
		for (let i = 0; i < l; i++) {
			actions.pop();
		}
		sync();
	});
});

function sync() {
	io.emit("sync", actions);
}

setInterval(sync, 5000);

server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

function Room(key, host) {
	this.key = key;
	this.host = host;
}
