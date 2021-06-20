class Shape {
	constructor(
		style = 'LINE',
		stroke = [0, 0, 0, 255],
		strokeWeight = 5,
		fill = [0, 0, 0, 0]
	) {
		this.style = style;
		this.stroke = stroke;
		this.strokeWeight = strokeWeight;
		this.fill = fill;
		this.points = [];
	}

	addPoint(x, y) {
		this.points.push([x, y]);
	}
	draw() {
		switch (this.style) {
			case 'LINE':
				noFill();
				stroke(this.stroke);
				strokeWeight(this.strokeWeight);
				beginShape();
				for (let i in this.points) {
					vertex(this.points[i][0], this.points[i][1]);
				}
				endShape();
				break;
			case 'CLOSE':
				// noFill();
				fill(255, 255, 0);
				stroke(this.stroke);
				strokeWeight(this.strokeWeight);
				beginShape();
				for (let i in this.points) {
					vertex(this.points[i][0], this.points[i][1]);
				}
				endShape(CLOSE);
		}
	}
}
