const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
//const server=spawn('node',['server.js']);
//const path = require('path');
const port = 8000;
let serverStarted = false;

const dirPublic = path.join(__dirname, 'public');
const dirFiles = {
	uploads: path.join(__dirname, 'uploads'),
	imgMenu: path.join(__dirname, 'uploads/imgMenu'),
};

const Server = require(path.join(__dirname, 'models/server'));

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
	});
	win.loadURL(`http://localhost:${port}`);
	console.log('ss', process.execPath).catch((err) => {
		console.log('error', err);
	});
};

app.whenReady()
	.then(() => {
        //Start server
		if (!serverStarted) {
			const server = new Server(dirPublic, port, dirFiles);
			server.listen();
			serverStarted = true;
		}
	})
	.then(() => {
		createWindow();
		app.on('activate', function () {
			if (BrowserWindow.getAllWindows().length === 0) createWindow();
		});
	})
	.catch((err) => {
		console.log(err);
	});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
