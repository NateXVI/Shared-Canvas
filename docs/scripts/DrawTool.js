class DrawTool extends Tool {
	constructor() {
		super();
		this.lastPos = null;
		this.limit = 10;
	}
	update() {
		this.drawCursor();
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
		this.lastPos = null;
	}
}
