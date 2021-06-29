document.getElementById('pen-tool').onclick = () => (tool = new DrawTool());
document.getElementById('line-tool').onclick = () => (tool = new LineTool());
document.getElementById('pan-tool').onclick = () => (tool = new PanTool());
document.getElementById('erase-tool').onclick = () => (tool = new EraseTool());
document.getElementById('eyedrop-tool').onclick = () =>
	(tool = new EyedropTool());

document.addEventListener('keydown', (e) => {
	switch (e.key) {
		case '1':
			tool = new DrawTool();
			break;
		case '2':
			tool = new LineTool();
			break;
		case '3':
			tool = new EraseTool();
			break;
		case '4':
			// tool = new EyedropTool();
			break;
	}
});

let goButton = document.getElementById('go-button');
let roomInput = document.querySelector('div.room input');
goButton.onclick = () => {
	if (roomInput.value != '') {
		console.log('not empty');
		host.changeRoom(roomInput.value);
	}
};

document.querySelector('input.color-picker').addEventListener('input', (e) => {
	toolColor = e.target.value;
});
let colorHistroty = ['#000000'];

document.querySelector('input.color-picker');
// .addEventListener('change', (e) => updateColorHistory(e));

function updateColorHistory(e) {
	console.log(e.target.value);
	toolColor = e.target.value;
	colorHistroty.push(e.target.value);
	if (colorHistroty.length > 2) colorHistroty.shift();

	let d = $('section.color-history');
	d.empty();

	for (let i in colorHistroty) {
		let c = d.append(
			`<div style="background:${colorHistroty[i]}" class="color-history" id="color${i}"></div>`
		);

		$(`#color${i}`).click((e) => {
			console.log(e, e.target.style.background);
		});
	}
}

function addColorToHistory(color) {}

// updateColorHistory();
