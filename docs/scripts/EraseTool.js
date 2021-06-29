class EraseTool extends DrawTool {
	constructor() {
		super();
		this.name = 'eraser';
		this.messageBarInit();
		this.setMessage('scroll to change size');
	}

	press(e) {
		if (e.button === 0 && isHovering) {
			this.eraseLine(mouse.x, mouse.y, mouse.x, mouse.y);
			this.lastPos = createVector(mouse.x, mouse.y);
		}
	}
	drag() {
		if (this.lastPos == null) return;
		let d = dist(this.lastPos.x, this.lastPos.y, mouseX, mouseY);
		if (d > this.limit) {
			this.eraseLine(this.lastPos.x, this.lastPos.y, mouse.x, mouse.y);
			this.lastPos.set(mouse.x, mouse.y);
		}
	}

	drawCursor() {
		if (isHovering) {
			stroke(0);
			fill(backgroundColor);
			strokeWeight(1);
			circle(mouse.x, mouse.y, toolSize);
		}
	}
}
