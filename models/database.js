const sqlite3 = require('sqlite3');
const fs = require('fs');
const DB_NAME = 'database.db';

var db;

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
}

function ConnectDB() {
	db = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.error(err.message);
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

module.exports = {
	InitDB,
	CloseDB,
};
