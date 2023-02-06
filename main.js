const {app,BrowserWindow} =require('electron')
const {spawn} =require('child_process')
const path = require('path');
//const server=spawn('node',['server.js']);

process.execPath = path.join(__dirname, 'nodejs/node.exe');

const server=spawn(process.execPath,[path.join(__dirname, 'app.js')]);

const createWindow=()=>{
    const win=new BrowserWindow({
        width:800,
        height:600
    })
    win.loadURL("http://localhost:8000")
    console.log("ss",process.execPath)
    .catch(err=>{
        console.log("error",err)
    })
}

app.whenReady().then(() => {
	createWindow();
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

server.stdout.on('data',data=>{
    console.log("server Start")
})

server.stderr.on('data', data => {
    console.error(`Server error: ${data}`);
});