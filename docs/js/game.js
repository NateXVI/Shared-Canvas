let socket;

// const backendUrl = "ws://localhost:3000/";
const backendUrl = "https://shared-canvass.herokuapp.com/";

let tools = ["pen", "eraser", "bucket"];
let currentTool = "pen";
let actions = [];
let currentAction;
let penColor;
let penSize = 5;

let drawBuffer = [];

let backgroundColor;

function setup() {
	gameCanvas = createCanvas(600, 450);
	gameCanvas.parent("game-canvas-container");
	backgroundColor = color(244, 248, 252);
	background(backgroundColor);

	penColor = color(0, 0, 0);
	console.log(penColor);

	socket = io(backendUrl);

	socket.on("draw action", function (msg) {
		actions.push(msg);
	});

	socket.on("sync", function (msg) {
		actions = msg;
		console.log(msg);
	});

	document.getElementById("pen-button").addEventListener("click", function () {
		currentTool = "pen";
	});
	document.getElementById("eraser-button").addEventListener("click", function () {
		currentTool = "eraser";
	});
}

function draw() {
	background(backgroundColor);
	drawActions();

	circle(mouseX, mouseY, penSize);
}

function drawActions() {
	for (let i in actions) {
		drawAction(actions[i]);
	}
	// drawAction(currentAction);
	if (currentAction) drawAction(currentAction);
}

function drawAction(action) {
	switch (action.tool) {
		case "pen":
			drawPenAction(action);
			break;
	}
}

function drawPenAction(action) {
	let s = action.strokes;
	let c = action.color;
	push();
	stroke(color(action.color));
	strokeWeight(action.size);
	for (let i = 0; i < s.length - 1; i++) {
		line(s[i][0], s[i][1], s[i + 1][0], s[i + 1][1]);
	}
	pop();
}

function mousePressed() {
	switch (currentTool) {
		case "pen":
		case "eraser":
			currentAction = newAction(currentTool);
			currentAction.strokes.push([mouseX, mouseY]);
			currentAction.strokes.push([mouseX, mouseY]);
			break;
	}
}

function mouseReleased() {
	actions.push(currentAction);
	currentAction = undefined;
	switch (currentTool) {
		case "pen":
		case "eraser":
			sendAction();
			break;
	}
}

function mouseDragged() {
	switch (currentTool) {
		case "pen":
		case "eraser":
			currentAction.strokes.push([mouseX, mouseY]);
			break;
	}
}

function sendAction() {
	let a = actions[actions.length - 1];

	socket.emit("draw action", a);
}

function newAction(type) {
	let action;
	switch (type) {
		case "pen":
			action = {
				tool: "pen",
				color: [red(penColor), green(penColor), blue(penColor)],
				size: penSize,
				strokes: [],
			};
			break;
		case "eraser":
			action = {
				tool: "pen",
				color: [
					red(backgroundColor),
					green(backgroundColor),
					blue(backgroundColor),
				],
				size: penSize,
				strokes: [],
			};
			break;
	}
	return action;
}

function undo() {
	socket.emit("undo");
}

function keyPressed() {
	if (keyIsDown(CONTROL) && key == "z") {
		undo();
	}
}

function mouseWheel(a) {
	penSize += a.delta < 0 ? 4 : -4;
	penSize = constrain(penSize, 1, 45);
}
