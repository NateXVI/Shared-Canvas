const socketUrl = 'ws://localhost:3000/';
let socket = io(socketUrl);

let tool;
let shapes = [];
let fillC = [0, 0, 0, 0];
let strokeC = [0, 0, 0, 255];
let strokeW = 6;
let backgroundColor = [255];

function setup() {
	tool = new DrawTool();
	createCanvas(windowWidth, windowHeight);
	background(...backgroundColor);
	$('#join-btn').click(() => joinRoom());

	joinRoom();

	socket.on('add shape', function (shape) {
		// console.log(shape);
		let s = new Shape(
			shape.style,
			shape.stroke,
			shape.strokeWeight,
			shape.fill
		);
		s.points = shape.points;
		shapes.push(s);
	});
	socket.on('clear canvas', () => {
		tool.shape = new Shape();
		shapes = [];
	});
}

function draw() {
	background(...backgroundColor);
	drawShapes();
	tool.update();
	tool.draw();
}

function joinRoom() {
	room = $('#room-input').val().trim();
	room = room == '' ? 'main' : room;
	socket.emit('join room', room);
	shapes = [];
}

function mousePressed(event) {
	tool.mousePressed(event);
	console.log(tool);
}

function touchStarted(event) {
	tool.mousePressed(event);
	console.log(tool);
}

function mouseReleased(event) {
	tool.mouseReleased(event);
}

function mouseDragged(event) {
	tool.mouseDragged(event);
}

function keyPressed(event) {
	if (keyCode === ENTER) {
		tool.onEnter(event);
	}
}

function addShape(shape) {
	shapes.push(shape);
	socket.emit('add shape', shape);
}

function drawShapes() {
	for (let i in shapes) {
		shapes[i].draw();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function clearCanvas() {
	shapes = [];
	tool.shape = new Shape();
	socket.emit('clear canvas');
}

function changeTool(t) {
	console.log(t);
	switch (t) {
		case 'drawtool':
			tool = new DrawTool();
			break;
		case 'polygontool':
			tool = new PolygonTool();
			break;
		case 'polyfilltool':
			tool = new PollyFillTool();
			break;
		case 'eraser':
			break;
	}
}

function mouseWheel(event) {
	change = event.delta / 50;
	console.log(change);
	strokeW += change;
	strokeW = constrain(strokeW, 1, 50);

	circle(mouseX, mouseY, strokeW);
}
