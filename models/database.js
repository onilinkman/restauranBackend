const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { error } = require('console');
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
	launchCreateUserModule();
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

function CreateTableMenu(callback) {
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
			callback(err);
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

function CreateTableRolUser(callback) {
	db.run(
		`CREATE TABLE IF NOT EXISTS rol_user(
		id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
		description TEXT NOT NULL
	)`,
		(err) => {
			if (err) {
				console.error('error to create table rol_user');
			} else {
				CreateRolDefault();
			}
			callback(err);
		}
	);
}

function addRol(id_rol, description, callback) {
	db.run(
		`INSERT OR IGNORE INTO rol_user(id_rol,description) VALUES (?,?)`,
		[id_rol, description],
		(err) => {
			callback(err);
		}
	);
}

function CreateRolDefault() {
	addRol(1, 'Manager', (err) => {
		if (err) {
			console.log('error to create manager');
		} else {
			addRol(2, 'Staff', (err2) => {
				if (err2) {
					console.log('Error to create Staff');
				} else {
					addRol(3, 'Client', (err3) => {
						if (err3) {
							console.log('Error to create Client');
						} else {
							console.log(
								'Manager, Staff, Client added successfull'
							);
						}
					});
				}
			});
		}
	});
}

function CreateTableUser(callback) {
	db.run(
		`CREATE TABLE IF NOT EXISTS user(
		id_user INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		first_names TEXT,
		p_lastname TEXT,
		m_lastname TEXT,
		ci TEXT,
		email TEXT,
		date_register TEXT DEFAULT (datetime('now')),
		id_rol INTEGER,
		is_active INTEGER,
		FOREIGN KEY (id_rol)
			REFERENCES rol_user (id_rol)
	)`,
		(err) => {
			callback(err);
			if (err) {
				console.error();
			} else {
				console.log();
			}
		}
	);
}

function CreateUserDefault(callback) {
	db.run(
		`INSERT OR IGNORE INTO user(id_user,username,password,id_rol,is_active) VALUES (1,"admin","$2b$10$u01RQyu2CeLNH.HMf2bDq.OZdfrrfzY1Gllk/mj8jT39CLHa.1H6m",1,1)`,
		(err) => {
			callback(err);
		}
	);
}

function CreateStateOrder() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS state_order(
		id_state INTEGER PRIMARY KEY AUTOINCREMENT,
		description TEXT
		)`,
			(err) => {
				if (err) {
					reject(err.message);
				} else {
					resolve('Table state_order is created');
				}
			}
		);
	});
}

function AddStateOrder(id_state, description, callback) {
	db.run(
		`INSERT OR IGNORE INTO state_order(id_state,description) VALUES (?,?)`,
		[id_state, description],
		(err) => {
			callback(err);
		}
	);
}

function CreateRowsDefaultStateOrder() {
	return new Promise((resolve, reject) => {
		AddStateOrder(1, 'abierto', (err1) => {
			if (err1) {
				reject('error to insert Rows', err1.message);
			} else {
				AddStateOrder(2, 'cerrado', (err2) => {
					if (err2) {
						reject('error to insert Rows', err2.message);
					} else {
						AddStateOrder(3, 'en_espera', (err3) => {
							if (err3) {
								reject('error to insert Rows', err3.message);
							} else {
								resolve('rows inserts in table State_order');
							}
						});
					}
				});
			}
		});
	});
}

function CreateTableAccessModule() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS access_module(
			id_user INTEGER NOT NULL,
			nro_module INTEGER NOT NULL,
			FOREIGN KEY (id_user)
				REFERENCES user (id_user)
		)`,
			(err) => {
				if (err) {
					reject('Error to create access_module');
				} else {
					resolve('Table access_module is created');
				}
			}
		);
	});
}

function CreateTable_TableRestaurant() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS table_restaurant(
			id_table INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			coordinate TEXT,
			state INTEGER DEFAULT 1,
			is_active INTEGER DEFAULT 1
		)`,
			(err) => {
				if (err) {
					reject('Error to create table_restaurant');
				} else {
					resolve('Table_restaurant is created');
				}
			}
		);
	});
}

function CreateTableBillTable() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS bill_table(
			id_bill_table INTEGER PRIMARY KEY AUTOINCREMENT,
			id_table INTEGER NOT NULL,
			note TEXT,
			date TEXT DEFAULT (datetime('now')),
			id_state INTEGER NOT NULL,
			is_deleted INTEGER DEFAULT 1,
			FOREIGN KEY (id_table)
				REFERENCES table_restaurant(id_table),
			FOREIGN KEY (id_state)
				REFERENCES state_order (id_state)
		)`,
			(err) => {
				if (err) {
					reject('Error to create table bill_table');
				} else {
					resolve('Table bill_table is created');
				}
			}
		);
	});
}

function CreateTableFloors() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS floors(
			id_floor INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT,
			description TEXT
		)`,
			(err) => {
				if (err) {
					reject('Error to create table floors');
				} else {
					resolve('Table floors is created');
				}
			}
		);
	});
}

function CreateTableFloorsTable() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS floors_table(
			id_floor INTEGER,
			id_table INTEGER UNIQUE,
			FOREIGN KEY (id_floor)
				REFERENCES floors(id_floor),
			FOREIGN KEY (id_table)
				REFERENCES table_restaurant(id_table)
		)`,
			(err) => {
				if (err) {
					reject('Error to create table floors_table');
				} else {
					resolve('Table floors_table is created');
				}
			}
		);
	});
}

function CreateTableBillUser() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS bill_user(
			id_bill_user INTEGER PRIMARY KEY AUTOINCREMENT,
			id_user INTEGER NOT NULL,
			id_table INTEGER,
			note TEXT,
			date TEXT DEFAULT (datetime('now')),
			id_state INTEGER NOT NULL,
			is_deleted INTEGER DEFAULT 1,
			FOREIGN KEY (id_user)
				REFERENCES user (id_user),
			FOREIGN KEY (id_state)
				REFERENCES state_order (id_state)
			FOREIGN KEY (id_table)
				REFERENCES table_restaurant(id_table)
			)`,
			(err) => {
				if (err) {
					reject('Error to create table bill_user');
				} else {
					resolve('Table bill_user is created');
				}
			}
		);
	});
}

function CreateTableOrderUser() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS order_user(
			id_bill_user INTEGER NOT NULL,
			id_menu INTEGER NOT NULL,
			price NUMERIC,
			amount INTEGER,
			FOREIGN KEY (id_bill_user)
				REFERENCES bill_user (id_bill_user),
			FOREIGN KEY (id_menu)
				REFERENCES menu (id_menu)
			)`,
			(err) => {
				if (err) {
					reject('Error to create Table order_user');
				} else {
					resolve('Table order_user is created');
				}
			}
		);
	});
}

function CreateTableBillClient() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS bill_client(
			id_bill_client INTEGER PRIMARY KEY AUTOINCREMENT,
			id_user INTEGER NOT NULL,
			id_table INTEGER,
			note TEXT,
			date TEXT DEFAULT (datetime('now')),
			id_state INTEGER NOT NULL,
			is_deleted INTEGER DEFAULT 1,
			FOREIGN KEY (id_user)
				REFERENCES user (id_user),
			FOREIGN KEY (id_state)
				REFERENCES state_order (id_state),
			FOREIGN KEY (id_table)
				REFERENCES table_restaurant (id_table)
			)`,
			(err) => {
				if (err) {
					reject('Error to create table bill_client');
				} else {
					resolve('Table bill_client is created');
				}
			}
		);
	});
}

function CreateTableOrderClient() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS order_client(
			id_bill_client INTEGER NOT NULL,
			id_menu INTEGER NOT NULL,
			price NUMERIC,
			amount INTEGER,
			FOREIGN KEY (id_bill_client)
				REFERENCES bill_client (id_bill_client),
			FOREIGN KEY (id_menu)
				REFERENCES menu (id_menu)
			)`,
			(err) => {
				if (err) {
					reject('Error to create Table order_client');
				} else {
					resolve('Table order_client is created');
				}
			}
		);
	});
}

function launchCreateUserModule() {
	let createModule = new Promise((resolve, reject) => {
		CreateTableMenu((err) => {
			if (err) {
				reject(err.message);
			} else {
				resolve('Table menu is created');
			}
		});
	});

	createModule
		.then((result) => {
			console.log(result);
			return new Promise((resolve, reject) => {
				CreateTableRolUser((err) => {
					if (err) {
						reject(err.message);
					} else {
						resolve('Table rol_user create');
					}
				});
			});
		})
		.then((result) => {
			console.log(result);
			return new Promise((resolve, reject) => {
				CreateTableUser((err) => {
					if (err) {
						reject('error to create Table user', err.message);
					} else {
						resolve('Table user is created');
					}
				});
			});
		})
		.then((result) => {
			console.log(result);
			return new Promise((resolve, reject) => {
				db.run(
					'CREATE INDEX IF NOT EXISTS idx_username ON user(username)',
					(err) => {
						if (err) {
							reject('error to create Index user', err.message);
						} else {
							resolve('Index is created');
						}
					}
				);
			});
		})
		.then((result) => {
			console.log(result);
			return new Promise((resolve, reject) => {
				CreateUserDefault((err) => {
					if (err) {
						reject('error to create user default', err);
					} else {
						resolve('user default is create');
					}
				});
			});
		})
		.then((result) => {
			console.log(result);
			return CreateStateOrder();
		})
		.then((result) => {
			console.log(result);
			return CreateRowsDefaultStateOrder();
		})
		.then((result) => {
			console.log(result);
			return CreateTableAccessModule();
		})
		.then((result) => {
			console.log(result);
			return CreateTable_TableRestaurant();
		})
		.then((result) => {
			console.log(result);
			return CreateTableBillTable();
		})
		.then((result) => {
			console.log(result);
			return CreateTableFloors();
		})
		.then((result) => {
			console.log(result);
			return CreateTableFloorsTable();
		})
		.then((result) => {
			console.log(result);
			return CreateTableBillUser();
		})
		.then((result) => {
			console.log(result);
			return CreateTableOrderUser();
		})
		.then((result) => {
			console.log(result);
			return CreateTableBillClient();
		})
		.then((result) => {
			console.log(result);
			return CreateTableOrderClient();
		})
		.then((result) => {
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
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
