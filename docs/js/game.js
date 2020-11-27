let socket;
const backendUrl = "ws://localhost:3000/";

let tools = ["pen", "eraser", "bucket"];
let currentTool = "pen";
let drawBuffer = [];

let backgroundColor;

function setup() {
	gameCanvas = createCanvas(600, 450);
	gameCanvas.parent("game-canvas-container");
	backgroundColor = color(244, 248, 252);
	background(backgroundColor);

	penColor = color(0);

	socket = io(backendUrl);
}

function draw() {}

function mousePressed() {
	switch (currentTool) {
	}
}

function mouseDragged() {
	switch (currentTool) {
		case "pen":
			break;
	}
}

function sendBuffer() {
	switch (currentTool) {
		case "pen":
			socket.emit("draw event", {
				tool: currentTool,
				color: penColor.levels,
				drawBuffer,
			});
			break;
	}
}

function checkBuffer() {
	if (drawBuffer.length > 20) {
		sendBuffer();
	}
}
