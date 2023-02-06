const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const { InitDB } = require('./database');
const { GetIP } = require('./dataSo');
const { UploadFile } = require('./uploads');

class Server {
	constructor(pathPublic, port, dirFiles) {
		this.app = express();
		this.pathPublic = pathPublic;
		this.port = port;
		InitDB();
		this.createDir(dirFiles.uploads);
		this.createDir(dirFiles.imgMenu);

		this.paths = {};

		// Middlewares
		this.middlewares();

		// Rutas de mi aplicación
		this.routes();

		this.sockets();
	}

	createDir(dir) {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
	}

	middlewares() {
		// CORS

		const corsOptions = {
			origin: '*',
			optionsSuccessStatus: 200,
		};

		this.app.use(cors(corsOptions));

		// Directorio Público
		this.app.use(express.static(this.pathPublic));
		this.app.use(
			fileUpload({
				limits: { fileSize: 50 * 1024 * 1024 },
			})
		);
	}

	routes() {
		this.app.get('*', (req, res) => {
			res.sendFile(this.pathPublic + '/index.html');
		});
		this.app.get('/getIp', (req, res) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.json({
				ip: GetIP(),
			});
		});
		this.app.post('/api/addItem', UploadFile);
	}

	sockets() {
		//this.io.on('connection', socketController);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log('run in port ', this.port);
		});
	}
}

module.exports = Server;
