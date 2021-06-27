class Tool {
	constructor() {
		this.resetCursor();
	}
	update() {}
	press() {}
	release() {}
	drag() {}

	scroll(e) {
		if (!e.ctrlKey) {
			const dif = 10 * (1 / zoom);
			if (e.delta > 0) {
				toolSize -= dif;
			} else if (e.delta < 0) {
				toolSize += dif;
			}
			toolSize = constrain(toolSize, 1, 100);
		}
	}

	draw(i /*instruction*/) {
		const d = i.data;
		switch (i.type) {
			case 'line':
				stroke(d.color);
				strokeWeight(d.weight);
				line(d.x1, d.y1, d.x2, d.y2);
				break;
			case 'erase':
				stroke(backgroundColor);
				strokeWeight(d.weight);
				line(d.x1, d.y1, d.x2, d.y2);
				break;
		}
	}

	drawLine(x1, y1, x2, y2) {
		addInstruction({
			index: getIndex(),
			type: 'line',
			data: {
				color: toolColor,
				weight: toolSize,
				x1,
				y1,
				x2,
				y2,
			},
		});
	}

	eraseLine(x1, y1, x2, y2) {
		addInstruction({
			index: getIndex(),
			type: 'erase',
			data: {
				color: toolColor,
				weight: toolSize,
				x1,
				y1,
				x2,
				y2,
			},
		});
	}

	drawCursor() {
		if (isHovering) {
			stroke(toolColor);
			strokeWeight(toolSize);
			point(mouse.x, mouse.y);
		}
	}

	resetCursor() {
		this.setCursorVisibility(0);
	}

	pan(x = 0, y = 0) {
		let izoom = 1 / zoom;
		offset.add(createVector(x * izoom, y * izoom));
		offset.x = round(offset.x);
		offset.y = round(offset.y);

		$('#xy').text(`X: ${-offset.x} Y: ${-offset.y}`);
	}
	setCursorVisibility(b) {
		$('canvas').css('cursor', b ? 'auto' : 'none');
	}
	setCursor(v) {
		$('canvas').css('cursor', v);
	}
}
