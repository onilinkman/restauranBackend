const { GetDB } = require('../database');

function AddMesaDB(name, callback) {
	let db = GetDB();
	if (db) {
		db.run(
			`INSERT INTO table_restaurant (name) VALUES (?)`,
			[name],
			(err) => {
				callback(err);
			}
		);
	}
}

function AddFloorDB(title, description, callback) {
	let db = GetDB();
	if (db) {
		db.run(
			`INSERT INTO floors(title,description) VALUES (?,?)`,
			[title, description],
			(err) => {
				callback(err);
			}
		);
	}
}

function AddFloorsTableDB(id_floor, id_table, callback) {
	let db = GetDB();
	if (db) {
		db.run(
			`INSERT INTO floors_table(id_floor,id_table) VALUES (?,?)`,
			[id_floor, id_table],
			(err) => callback(err)
		);
	}
}

module.exports = {
	AddMesaDB,
	AddFloorDB,
	AddFloorsTableDB,
};
