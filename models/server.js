const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const { InitDB } = require('./database');
const { GetIP } = require('./dataSo');
const { validateJWT } = require('./middlewares/jwt');
const {
	autorizePersonal,
	autorizeMesa,
} = require('./middlewares/authentication');
const { UploadFile, GetMenu, GetRecetas, UpdateImage } = require('./uploads');
const {
	PostSection,
	GetSection,
	PutSection,
	DeleteSection,
	GetSectionNotDeleted,
	GetMenu_Section,
	PostMenuSection,
	DeleteMenuSection,
	GetMenuById,
	DeleteIngredient,
	InsertIngredient,
	PutIngredient,
	PutPriceIngredient,
	DeleteItem,
} = require('./api/kitchen');

const { GetIdsMenuBySection } = require('./api/menu');

const { AddMesa, AddFloor, AddFloorsTable } = require('./api/mesas');

const {
	LoginUsername,
	AddUserPersonal,
	GetAllPersonnel,
	UpdatePersonnelIsActive,
	GetAccessModulePersonnel,
	AddAccessModulePersonnel,
	DeleteAccessModulePersonnel,
	AddUserClient,
	GetAllClient,
	AddBillClient,
	GetBillClientOpen,
} = require('./api/user');

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
		this.app.delete('/api/deleteMenuSection', DeleteMenuSection);
		this.app.get('/api/getMenuById', GetMenuById);
		this.app.delete('/api/deleteIngredient', DeleteIngredient);
		this.app.post('/api/addIngredient', InsertIngredient);
		this.app.put('/api/putIngredient', PutIngredient);
		this.app.put('/api/updateImage', UpdateImage);
		this.app.put('/api/putPriceIngredient', PutPriceIngredient);
		this.app.delete('/api/deleteItem', DeleteItem);
		//ENDPOINT FOR MENU
		this.app.get('/api/getIdsMenuBySection', GetIdsMenuBySection);
		//ENDPOINT FOR MESAS
		this.app.post('/api/addMesa', [validateJWT, autorizeMesa, AddMesa]);
		this.app.post('/api/addFloor', [validateJWT, autorizeMesa, AddFloor]);
		this.app.post('/api/addFloorsTable', [
			validateJWT,
			autorizeMesa,
			AddFloorsTable,
		]);
		//ENDPOINT FOR USERS
		this.app.post('/api/auth/login', [LoginUsername]);
		this.app.post('/api/addUserPersonal', [validateJWT, AddUserPersonal]);
		this.app.get('/api/v1/getPersonnel', [
			validateJWT,
			autorizePersonal,
			GetAllPersonnel,
		]);
		this.app.post('/api/updatePersonnelIsActive', [
			validateJWT,
			UpdatePersonnelIsActive,
		]);
		this.app.post('/api/getAccessModulePersonnel', [
			validateJWT,
			GetAccessModulePersonnel,
		]);
		this.app.post('/api/addAccessModulePersonnel', [
			validateJWT,
			AddAccessModulePersonnel,
		]);
		this.app.delete('/api/deleteAccessModulePersonnel', [
			validateJWT,
			DeleteAccessModulePersonnel,
		]);
		this.app.post('/api/addUserClient', [AddUserClient]);
		this.app.get('/api/getAllClient', [validateJWT, GetAllClient]);
		this.app.post('/api/addBillClient', [validateJWT, AddBillClient]);
		this.app.get('/api/getBillClientOpen', [
			validateJWT,
			GetBillClientOpen,
		]);
		//#####################################################
		//#####################################################
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
