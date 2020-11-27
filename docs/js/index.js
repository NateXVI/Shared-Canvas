let socket;
let tool = "pen";
let penSize = 5;
let penColor;

let points = [];

const socketUrl = "https://shared-canvass.herokuapp.com/";

function setup() {
	createCanvas(900, 600);
	// frameRate(10);
	background(244, 248, 252);
	penColor = color(255, 0, 0);
	console.log(penColor.levels);
	stroke(penColor);
	socket = io(socketUrl);

	socket.on("canvas init", function (msg) {
		for (let i in msg) {
			drawStrokes(msg[i]);
		}
	});
	socket.on("stroke", function (msg) {
		drawStrokes(msg);
		console.log(msg);
	});
	socket.on("delete canvas", function () {
		background(244, 248, 252);
	});
}

function draw() {}

function mouseDragged() {
	strokeWeight(penSize);
	stroke(penColor);

	line(pmouseX, pmouseY, mouseX, mouseY);

	if (points.length == 0) points.push([pmouseX, pmouseY]);
	points.push([mouseX, mouseY]);

	if (points.length > 15) {
		sendStroke();
	}

	pmouseX = mouseX;
	pmouseY = mouseY;
}

function mouseClicked() {
	strokeWeight(penSize);
	stroke(penColor);

	point(mouseX, mouseY);
	socket.emit("stroke", {
		size: penSize,
		color: penColor.levels,
		points: [[mouseX, mouseY]],
	});
}

function mouseReleased() {
	sendStroke();
}

function sendStroke() {
	socket.emit("stroke", {
		size: penSize,
		color: penColor.levels,
		points,
	});

	points = [];
}

function drawStrokes(data) {
	let s = data.size;
	let c = color(...data.color);
	let p = data.points;
	push();
	stroke(c);
	strokeWeight(s);

	if (p.length > 1) {
		for (let i = 0; i < p.length - 1; i++) {
			line(p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]);
		}
	}
	if (p.length > 0) point(p[0][0], p[0][1]);
	pop();
}

function mouseWheel(event) {
	if (mouseIsPressed) sendStroke();
	let change = 5;
	penSize += event.delta < 100 ? change : -change;
	penSize = constrain(penSize, 5, 100);
	console.log(penSize);
}

function keyPressed(event) {
	if (event.code == "KeyD") {
		socket.emit("delete canvas");
	}

	console.log(event.code);
}
