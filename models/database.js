const sqlite3 = require('sqlite3');
const fs = require('fs');
const DB_NAME = 'database.db';
var db;
var is_off_Transaction = true;

function createDB() {
	db = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Base de datos creada');
	});
}

function InitDB() {
	if (existDB()) {
		ConnectDB();
	} else {
		createDB();
		ConnectDB();
	}
	CreateTableMenu();
	CreateTableIngredient();
	CreateTableSection();
	CreateTableMenuSection();
}

function ConnectDB() {
	db = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.error('error al conectar', err.message);
		}
	});
	console.log('conectado a la base de datos');
}

function existDB() {
	return fs.existsSync(DB_NAME);
}

function CloseDB() {
	db.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Se Cerro la conexion con la base de datos');
	});
}

function CreateTableMenu() {
	db.run(
		`CREATE TABLE IF NOT EXISTS menu(
			id_menu INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT,
			description TEXT,
			url_image TEXT,
			price NUMERIC,
			is_deleted INTEGER DEFAULT 1
			)`,
		(err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('Tabla jugador Creada');
		}
	);
}

function CreateTableIngredient() {
	db.run(
		`CREATE TABLE IF NOT EXISTS ingredient(
			id_ingredient INTEGER PRIMARY KEY AUTOINCREMENT,
			description TEXT,
			id_menu INTEGER NOT NULL,
			FOREIGN KEY (id_menu)
				REFERENCES menu (id_menu))`,
		(err) => {
			if (err) {
				console.error('error: ', err.message);
			}
			console.log('Tabla Ingredient creada');
		}
	);
}

function CreateTableSection() {
	db.run(
		`CREATE TABLE IF NOT EXISTS section(
			id_section INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			description TEXT,
			is_deleted INTEGER DEFAULT 1)`,
		(err) => {
			if (err) {
				console.error('error to create table section', err.message);
			} else {
				console.log('Tabla section creada');
			}
		}
	);
}

function CreateTableMenuSection() {
	db.run(
		`CREATE TABLE IF NOT EXISTS menu_section(
			id_menu INTEGER NOT NULL,
			id_section INTEGER NOT NULL,
			FOREIGN KEY (id_menu)
				REFERENCES menu (id_menu),
			FOREIGN KEY (id_section)
				REFERENCES section (id_section)
		)`,
		(err) => {
			if (err) {
				console.error(
					'error to create table menu_section',
					err.message
				);
			} else {
				console.log('Tabla menu_section create');
			}
		}
	);
}

function GetDB() {
	return db;
}

function IsOffTransaction() {
	return is_off_Transaction;
}

function SetTransaction(value) {
	is_off_Transaction = value;
}

module.exports = {
	InitDB,
	CloseDB,
	GetDB,
	IsOffTransaction,
	SetTransaction,
};
