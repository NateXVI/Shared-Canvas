class Tool {
	constructor() {
		this.resetCursor();
		this.name = 'tool';
		this.message = new MessageBar();
		this.messageBarInit();
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
			stroke(backgroundColor);
			fill(toolColor);
			strokeWeight(1);
			circle(mouse.x, mouse.y, toolSize);
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
		redrawInstructions();
	}
	setCursorVisibility(b) {
		$('canvas').css('cursor', b ? 'auto' : 'none');
	}
	setCursor(v) {
		$('canvas').css('cursor', v);
	}

	messageBarInit() {
		this.message.clear();
		this.message.add(`Current tool: ${this.name}`);
	}

	setMessage(message) {
		this.messageBarInit();
		this.message.add(message);
	}

	restoreMessages(messages) {
		this.message.messages = messages;
		this.message.update();
	}
}
