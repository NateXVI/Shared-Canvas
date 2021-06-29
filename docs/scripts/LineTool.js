class LineTool extends Tool {
	constructor() {
		super();
		this.isActivated = false;
		this.firstPoint = createVector();
		this.name = 'line';
		this.messageBarInit();
		this.setMessage('click to start line');
	}

	press(e) {
		if (e.button === 0 && isHovering) {
			if (this.isActivated) {
				this.isActivated = false;
				this.drawLine(this.firstPoint.x, this.firstPoint.y, mouse.x, mouse.y);
				this.setMessage('click to start line');
			} else {
				this.isActivated = true;
				this.firstPoint.set(mouse.x, mouse.y);
				this.setMessage(['left click to draw line', 'right click to cancle']);
			}
		} else if (e.button === 2 && isHovering) {
			this.setMessage('click to start line');
			this.isActivated = false;
		}
	}

	release(e) {}

	drag() {}

	update() {
		this.drawCursor();
		if (this.isActivated) {
			strokeWeight(toolSize);
			stroke(toolColor);
			line(this.firstPoint.x, this.firstPoint.y, mouse.x, mouse.y);
		}
	}
}
