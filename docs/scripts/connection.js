// const socketAddress = 'ws://localhost:3000';
const socketAddress = 'https://shared-canvas3.herokuapp.com/';

class Host {
	constructor() {
		this.socket = io(socketAddress);
		this.counter = 0;

		this.socket.on('connection', () => {
			console.log('connected');
		});

		this.socket.on('instruction', (i) => this.recieveInstruction(i));
		this.socket.on('set instructions', (i) => {
			if (i) instructions = i;
		});
	}

	sendInstruction(i) {
		this.socket.emit('instruction', i);
	}

	recieveInstruction(i) {
		instructions.push(i);

		this.counter++;
		if (this.counter >= 10) {
			instructions = instructions.sort((a, b) => a.index - b.index);
		}
	}

	changeRoom(room) {
		instructions = [];
		this.socket.emit('joinRoom', room);
		redrawInstructions();
	}
}
