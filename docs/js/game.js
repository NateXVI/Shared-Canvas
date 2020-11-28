let socket;

// const backendUrl = "ws://localhost:3000/";
const backendUrl = "https://shared-canvass.herokuapp.com/";
let colorButtons;
let canvas;
let canvasParent;
let aspectRatio;
let colorviewer;

let tools = ["pen", "eraser", "bucket"];
let currentTool = "pen";
let actions = [];
let currentAction;
let penColor;
let penSize = 5;

let drawBuffer = [];

let backgroundColor;

function setup() {
	gameCanvas = createCanvas(700, 500);
	gameCanvas.parent("game-canvas-container");
	canvas = document.getElementById("defaultCanvas0");
	canvasParent = document.getElementById("game-canvas-container");
	aspectRatio = height / width;
	windowResized();
	colorviewer = document.getElementById("colorviewer");
	backgroundColor = color(255);
	background(backgroundColor);

	penColor = color(0, 0, 0);
	console.log(penColor);

	socket = io(backendUrl);

	socket.on("draw action", function (msg) {
		actions.push(msg);
	});

	socket.on("sync", function (msg) {
		actions = msg;
		console.log("synced");
	});

	document.getElementById("pen-button").addEventListener("click", function () {
		currentTool = "pen";
	});
	document.getElementById("eraser-button").addEventListener("click", function () {
		currentTool = "eraser";
	});
	document.getElementById("bucket-button").addEventListener("click", function () {
		currentTool = "bucket";
	});
	document.getElementById("undo-button").addEventListener("click", function () {
		undo();
	});
	document.getElementById("redo-button").addEventListener("click", function () {
		redo();
	});
	document.getElementById("delete-button").addEventListener("click", function () {
		socket.emit("delete");
	});
	let colorButtons = document.getElementsByClassName("color");
	console.log(
		colorButtons[1]
			.getAttribute("picker-color")
			.split(",")
			.map((value, index) => parseInt(value))
	);
	for (let i = 0; i < colorButtons.length; i++) {
		colorButtons[i].addEventListener("click", function (event) {
			console.log(event.target);
			let c = event.target
				.getAttribute("picker-color")
				.split(",")
				.map((v) => parseInt(v));
			penColor = color(...c);

			colorviewer.style.background = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
		});
	}
}

function draw() {
	background(backgroundColor);
	drawActions();

	push();
	fill(penColor);
	stroke(0);
	circle(mouseX, mouseY, penSize);
	pop();
}

function drawActions() {
	for (let i in actions) {
		drawAction(actions[i]);
	}
	// drawAction(currentAction);
	if (currentAction) drawAction(currentAction);
}

function drawAction(action) {
	try {
		switch (action.tool) {
			case "pen":
				drawPenAction(action);
				break;
			case "bucket":
				drawBucketAction(action);
				break;
		}
	} catch (error) {
		console.log(error);
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

function drawBucketAction(action) {
	// location = action.location;
	// function pos(x, y) {
	// 	return 4 * (y * width + x);
	// }
	// loadPixels();
	// pixels[pos(...location)] = 0;
	// updatePixels();
}

function mousePressed() {
	if (mouseX > -10 && mouseX < width + 10 && mouseY > -10 && mouseY < height + 10) {
		switch (currentTool) {
			case "pen":
			case "eraser":
				currentAction = newAction(currentTool);
				currentAction.strokes.push([mouseX, mouseY]);
				currentAction.strokes.push([mouseX, mouseY]);
				break;
			case "bucket":
				currentAction = newAction(currentTool);
				actions.push(currentAction);
				currentAction = undefined;
				sendAction();
		}
	}
}

function mouseReleased() {
	if (currentAction != undefined) {
		actions.push(currentAction);
		currentAction = undefined;
		switch (currentTool) {
			case "pen":
			case "eraser":
				sendAction();
				break;
		}
	}
}

function mouseDragged() {
	if (currentAction != undefined) {
		switch (currentTool) {
			case "pen":
			case "eraser":
				currentAction.strokes.push([mouseX, mouseY]);
				break;
		}
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
				color: [red(backgroundColor), green(backgroundColor), blue(backgroundColor)],
				size: penSize,
				strokes: [],
			};
			break;
		case "bucket":
			action = {
				tool: "bucket",
				color: [red(penColor), green(penColor), blue(penColor)],
				location: [mouseX, mouseY],
			};
	}
	return action;
}

function undo() {
	socket.emit("undo");
}

function redo() {
	socket.emit("redo");
}

function keyPressed() {
	if (keyIsDown(CONTROL) && key == "x") {
		redo();
	}
	if (keyIsDown(CONTROL) && key == "z") {
		undo();
	}
	if (key == "d") {
		socket.emit("delete");
		console.log("deleted");
	}
}

function mouseWheel(a) {
	penSize += a.delta < 0 ? 4 : -4;
	penSize = constrain(penSize, 1, 45);
}

function windowResized() {
	let w = canvasParent.offsetWidth;
	canvas.style.width = `${w}px`;
	canvas.style.height = `${w * aspectRatio}px`;
}
