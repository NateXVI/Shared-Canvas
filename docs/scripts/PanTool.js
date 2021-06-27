class PanTool extends Tool {
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
