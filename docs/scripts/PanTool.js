class PanTool extends Tool {
	constructor() {
		super();
		this.name = 'hand';
		this.messageBarInit();
		this.setMessage('click and drag to pan around');
	}
	press() {
		this.setCursor('grabbing');
	}
	release() {
		this.setCursor('grab');
	}

	drag() {
		this.pan(movedX, movedY);
	}

	resetCursor() {
		this.setCursor('grab');
	}
}
