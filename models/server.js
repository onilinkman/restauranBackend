const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const { InitDB } = require('./database');
const { GetIP } = require('./dataSo');
const { UploadFile, GetMenu, GetRecetas } = require('./uploads');
const {
	PostSection,
	GetSection,
	PutSection,
	DeleteSection,
	GetSectionNotDeleted,
	GetMenu_Section,
	PostMenuSection,
	DeleteMenuSection,
} = require('./api/kitchen');

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

		this.app.use(express.json());
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
		this.app.get('/api/getSections', GetSection);
		this.app.get('/api/getSectionNotDeleted', GetSectionNotDeleted);
		this.app.put('/api/updateSection', PutSection);
		this.app.delete('/api/deleteSection', DeleteSection);
		this.app.get('/api/getMenuSection', GetMenu_Section);
		this.app.post('/api/postMenuSection', PostMenuSection);
		this.app.delete('/api/deleteMenuSection',DeleteMenuSection);
		this.app.get('/uploads/imgMenu', (req, res) => {
			let p = path.join(
				__dirname,
				'../uploads',
				'imgMenu',
				req.query.img
			);
			if (fs.existsSync(p)) {
				res.sendFile(p);
			} else {
				res.sendStatus(404);
			}
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
