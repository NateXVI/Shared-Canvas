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

let colorHistory = [];
let colorHistroySection;

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

	colorHistroySection = $('section.color-history');
}

function draw() {
	// scale(zoom);
	translate(offset.x, offset.y);
	checkHover();
	updateMouse();
	drawInstructions();
	tool.update();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	redrawInstructions();
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
let rmessages;
function keyPressed(e) {
	if (e.key === ' ') {
		ptool = tool;
		rmessages = tool.message.messages;
		tool = new PanTool();
	} else if (e.key === '4') {
		ptool = tool;
		rmessages = tool.message.messages;
		tool = new EyedropTool();
	}
}

function keyReleased(e) {
	if (e.key === ' ' || e.key === '4') {
		tool = ptool;
		tool.resetCursor();
		tool.restoreMessages(rmessages);
	}
}

function mouseWheel(e) {
	// if (e.ctrlKey) {
	// 	if (e.delta > 0) {
	// 		zoom -= 0.1;
	// 	} else if (e.delta < 0) {
	// 		zoom += 0.1;
	// 	}
	// 	zoom = constrain(zoom, 0.5, 2);

	// 	$('#scale').text(`Scale: ${(Math.round(zoom * 100) / 100).toFixed(2)}x`);
	// } else {
	// }
	tool.scroll(e);

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
	background(backgroundColor);

	if (frame && bookmark != 0 && instructions)
		image(frame, -offset.x, -offset.y);
	// if (bookmark == 0) console.log('frame drawn');
	for (i = bookmark; i < instructions.length; i++) {
		tool.draw(instructions[i]);
		// console.log('something drawn', i);
	}
	frame = get();
	bookmark = instructions.length;
}

function redrawInstructions() {
	bookmark = 0;
}

function checkHover() {
	isHovering = $('canvas:hover').length > 0;
}

function updateMouse() {
	mouse.set(mouseX, mouseY);
	// mouse.div(zoom);
	mouse.sub(offset);
}

function changeToolColor(c) {}

function addColorToHistory(c) {}
