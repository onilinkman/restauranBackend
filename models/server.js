const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const { InitDB } = require('./database');
const { GetIP } = require('./dataSo');
const { UploadFile, GetMenu, GetRecetas } = require('./uploads');
const { PostSection, GetSection, PutSection } = require('./api/kitchen');

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
		this.app.use(fileUpload());

		this.app.use(express.json())
	}

	routes() {
		this.app.get('/getIp', (req, res) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.json({
				ip: GetIP(),
			});
		});
		this.app.post('/api/addItem', UploadFile);
		this.app.get('/api/getMenu', GetMenu);
		this.app.get('/api/recetas', GetRecetas);
		this.app.post('/api/addSection', PostSection);
		this.app.get('/api/getSections',GetSection)
		this.app.put('/api/updateSection',PutSection)
		this.app.get('/uploads/imgMenu', (req, res) => {
			res.sendFile(
				path.join(__dirname, '../uploads', 'imgMenu', req.query.img)
			);
		});
		this.app.get('*', (req, res) => {
			res.sendFile(this.pathPublic + '/index.html');
		});
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
