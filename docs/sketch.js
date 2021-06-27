let tool;
let toolColor;
let toolSize;

let instructions = [];
let bookmark = 0;
let frame;

let shouldRedraw = false;
let isHovering = false;
let mouse;
let backgroundColor = 255;

let zoom = 1;
let offset;

let host;

function setup() {
	document.addEventListener('contextmenu', (event) => event.preventDefault());
	createCanvas(windowWidth, windowHeight);
	background(backgroundColor);
	tool = new DrawTool();
	offset = createVector(0, 0);
	tool.pan();
	toolColor = 0;
	toolSize = 10;
	mouse = createVector();
	frame = get();

	host = new Host();
}

function draw() {
	background(backgroundColor);
	scale(zoom);
	translate(offset.x, offset.y);
	checkHover();
	updateMouse();
	drawInstructions();
	tool.update();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(e) {
	tool.press(e);
}

function mouseReleased(e) {
	tool.release(e);
}

function mouseDragged() {
	tool.drag();
}

let ptool;
function keyPressed(e) {
	if (e.key === ' ') {
		ptool = tool;
		tool = new PanTool();
	}
}

function keyReleased(e) {
	if (e.key === ' ') {
		tool = ptool;
		tool.resetCursor();
	}
}

function mouseWheel(e) {
	if (e.ctrlKey) {
		if (e.delta > 0) {
			zoom -= 0.1;
		} else if (e.delta < 0) {
			zoom += 0.1;
		}
		zoom = constrain(zoom, 0.5, 2);

		$('#scale').text(`Scale: ${(Math.round(zoom * 100) / 100).toFixed(2)}x`);
	} else {
		tool.scroll(e);
	}

	return false;
}

function getIndex() {
	return instructions.length;
}

function addInstruction(i) {
	instructions.push(i);
	shouldRedraw = true;
	host.sendInstruction(i);
}

function drawInstructions() {
	for (i = bookmark; i < instructions.length; i++) {
		tool.draw(instructions[i]);
		// console.log('something drawn');
	}
}

function checkHover() {
	isHovering = $('canvas:hover').length > 0;
}

function updateMouse() {
	mouse.set(mouseX, mouseY);
	mouse.div(zoom);
	mouse.sub(offset);
}
