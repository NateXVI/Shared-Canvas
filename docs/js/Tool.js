class Tool {
	constructor() {
		this.shape = new Shape();
	}

	mousePressed(event) {
		console.log('mouse pressed');
	}
	mouseReleased(event) {
		console.log('mouse released');
	}
	mouseDragged(event) {}
	draw() {
		this.shape.draw();
	}
	onEnter(event) {}
	update() {}
}

class DrawTool extends Tool {
	constructor() {
		super();
		this.enabled = false;
	}

	mousePressed(event) {
		if (event.toElement.id == 'defaultCanvas0') {
			this.enabled = true;
			this.shape = new Shape();
			this.shape.style = 'LINE';
			this.shape.fill = fillC;
			this.shape.stroke = strokeC;
			this.shape.strokeWeight = strokeW;
			this.shape.addPoint(mouseX, mouseY);
			this.shape.addPoint(mouseX, mouseY);
		} else {
			this.enabled = false;
		}
	}
	mouseDragged(event) {
		if (!this.enabled) return;
		let lastPoint = this.shape.points[this.shape.points.length - 1];
		if (dist(lastPoint[0], lastPoint[1], mouseX, mouseY) > 5) {
			this.shape.addPoint(mouseX, mouseY);
		}
	}
	mouseReleased(event) {
		if (!this.enabled) return;
		addShape(this.shape);
	}

	draw() {
		this.shape.draw();
		noStroke();
		fill(strokeC);
		circle(mouseX, mouseY, strokeW);
	}
}

class PolygonTool extends Tool {
	constructor() {
		super();
		this.enabled = false;
	}

	mousePressed(event) {
		if (!this.enabled) {
			this.enabled = true;
			this.shape = new Shape();
			this.shape.stroke = strokeC;
			this.shape.strokeWeight = strokeW;
			this.shape.fill = 0;
			this.shape.style = 'CLOSE';
		}
		this.shape.addPoint(mouseX, mouseY);
	}

	draw() {
		if (!this.enabled) {
			this.shape.addPoint(mouseX, mouseY);
			this.shape.draw();
			this.shape.points.pop();
		} else {
			noStroke();
			circle(mouseX, mouseY, strokeW);
		}
	}
	onEnter(event) {
		addShape(this.shape);
		this.enabled = false;
	}
}
