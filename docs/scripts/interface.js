document.getElementById('pen-tool').onclick = () => (tool = new DrawTool());
document.getElementById('line-tool').onclick = () => (tool = new LineTool());
document.getElementById('pan-tool').onclick = () => (tool = new PanTool());
document.getElementById('erase-tool').onclick = () => (tool = new EraseTool());

let goButton = document.getElementById('go-button');
let roomInput = document.querySelector('div.room input');
goButton.onclick = () => {
	if (roomInput.value != '') {
		console.log('not empty');
		host.changeRoom(roomInput.value);
	}
};
