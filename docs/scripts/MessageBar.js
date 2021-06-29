class MessageBar {
	constructor() {
		this.bar = $('p.message-bar');
		this.messages = ['asdfasdf', 'nanya'];
	}

	update() {
		this.bar.text(this.messages[0]);
		let s = '';

		for (let i in this.messages) {
			s += this.messages[i];
			if (i < this.messages.length - 1) s += '  |  ';
		}

		this.bar.text(s);

		if (this.messages.length == 0) {
			this.bar.hide();
		} else {
			this.bar.show();
		}
	}

	add(message) {
		if (typeof message == 'string') this.messages.push(message);
		else if (typeof message == 'object') this.messages.push(...message);
		this.update();
	}

	clear() {
		this.messages = [];
		this.update();
	}
}
