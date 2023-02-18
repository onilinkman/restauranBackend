const { GetDB } = require('../database');

const AddItem = (title, description, ingredients, price, type, callback) => {
	let db = GetDB();
	let url_image = '';
	var cad = '';
	if (db) {
		db.serialize(function () {
			db.run('BEGIN TRANSACTION');
			db.run(
				'INSERT INTO menu(title, description, url_image,price) VALUES(?,?,?,?)',
				[title, description, this.lastID, price],
				function (err) {
					if (err) {
						return db.run('ROLLBACK');
					}
					let menuId = this.lastID;
					url_image = menuId + type;
					cad = menuId + type;
					db.run(
						'UPDATE menu SET url_image= ? WHERE id_menu=?',
						[url_image, menuId],
						function (err) {
							if (err) {
								return db.run('ROLLBACK');
							}
							let stmt = db.prepare(
								'INSERT INTO ingredient(description,id_menu) VALUES(?,?)'
							);
							let ingredient = JSON.parse(ingredients);
							for (let i = 0; i < ingredient.length; i++) {
								stmt.run(
									[ingredient[i], menuId],
									function (err) {
										if (err) {
											return db.run('ROLLBACK');
										}
									}
								);
							}
							stmt.finalize();
							db.run('COMMIT');
							callback(cad);
						}
					);
				}
			);
		});
	}
};

function GetRecetasDB(callback) {
	let db = GetDB();
	db.all(
		`SELECT m.id_menu,m.title, m.description,m.url_image,m.price,i.description as desc_ing FROM menu m
		INNER JOIN ingredient i ON i.id_menu= m.id_menu
		WHERE m.is_deleted=1`,
		(err, rows) => {
			if (err) {
				return console.error('error GetRecetas: ', err.message);
			}
			callback(rows);
		}
	);
}

/**
 * Add in database a row in tabke section
 * @param {String} name
 * @param {String} description
 * @param {function} callback
 */
function AddSection(name, description, callback) {
	let db = GetDB();
	db.run(
		`INSERT INTO section(name,description) VALUES(?,?)`,
		[name, description],
		function (err) {
			if (err) {
				return console.error('Error addSection:', err.message);
			}
			callback();
		}
	);
}

/**
 * Get all rows from section table
 * @param {function} callback
 */
function GetSectionDB(callback) {
	let db = GetDB();
	db.all(
		`SELECT id_section,name,description,is_deleted FROM section`,
		[],
		function (err, rows) {
			if (err) {
				return console.error('Error GetSectionDB', err.message);
			}
			callback(rows);
		}
	);
}

/**
 * update section table and get all rows from table
 * @param {number} id_section 
 * @param {String} name 
 * @param {String} description 
 * @param {function} callback 
 */
function UpdateSection(id_section, name, description, callback) {
	let db = GetDB();
	db.run('BEGIN TRANSACTION');
	db.run(
		'UPDATE section SET name=?,description=? WHERE id_section=?',
		[name, description, id_section],
		function (err) {
			if (err) {
				return db.run('ROLLBACK');
			}
			db.all(
				'SELECT id_section,name,description,is_deleted FROM section',
				function (err, rows) {
					if (err) {
						return db.run('ROLLBACK');
					}
					db.run('COMMIT');
					callback(rows);
				}
			);
		}
	);
}

module.exports = {
	AddItem,
	GetRecetasDB,
	AddSection,
	GetSectionDB,
	UpdateSection,
};
