class DrawTool extends Tool {
	constructor() {
		super();
		this.lastPos = null;
		this.limit = 20;

		this.name = 'pencil';
		this.messageBarInit();
		this.setMessage('scroll to change size');
	}
	update() {
		this.drawCursor();

		if (mouseIsPressed && this.lastPos != null) {
			stroke(toolColor);
			if (this.name == 'eraser') stroke(backgroundColor);
			strokeWeight(toolSize);
			line(this.lastPos.x, this.lastPos.y, mouse.x, mouse.y);
		}
	}
	press(e) {
		if (e.button === 0 && isHovering) {
			this.drawLine(mouse.x, mouse.y, mouse.x, mouse.y);
			this.lastPos = createVector(mouse.x, mouse.y);
		}
	}
	drag() {
		if (this.lastPos == null) return;
		let d = dist(this.lastPos.x, this.lastPos.y, mouseX, mouseY);
		if (d > this.limit) {
			this.drawLine(this.lastPos.x, this.lastPos.y, mouse.x, mouse.y);
			this.lastPos.set(mouse.x, mouse.y);
		}
	}
	release() {
		if (isHovering) {
			if (this.name == 'eraser')
				this.eraseLine(this.lastPos.x, this.lastPos.y, mouse.x, mouse.y);
			else this.drawLine(this.lastPos.x, this.lastPos.y, mouse.x, mouse.y);
		}
		this.lastPos = null;
	}
}
