class EyedropTool extends Tool {
	constructor() {
		super();
		this.name = 'eyedrop';
		this.messageBarInit();
	}

	press() {
		if (isHovering) {
			let c = color(get(mouseX, mouseY));
			if (isHovering) toolColor = get(mouseX, mouseY);
			document.querySelector('input.color-picker').value =
				c.toString('#rrggbb');
		}
	}

	drag() {
		this.press();
	}

	resetCursor() {
		this.setCursor('crosshair');
	}
}
