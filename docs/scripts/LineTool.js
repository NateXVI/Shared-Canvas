class LineTool extends Tool {
	constructor() {
		super();
		this.isActivated = false;
		this.firstPoint = createVector();
	}

	press(e) {
		if (e.button === 0 && isHovering) {
			if (this.isActivated) {
				this.isActivated = false;
				this.drawLine(this.firstPoint.x, this.firstPoint.y, mouse.x, mouse.y);
			} else {
				this.isActivated = true;
				this.firstPoint.set(mouse.x, mouse.y);
			}
		} else if (e.button === 2 && isHovering) {
			this.isActivated = false;
		}
	}

	release(e) {}

	drag() {}

	update() {
		this.drawCursor();
		if (this.isActivated) {
			line(this.firstPoint.x, this.firstPoint.y, mouse.x, mouse.y);
		}
	}
}
