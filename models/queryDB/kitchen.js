const { GetDB } = require('../database');
const async = require('async');

const AddItem = (title, description, ingredients, price, type, callback) => {
	let db = GetDB();
	let url_image = '';
	var cad = '';
	if (db) {
		db.serialize(function () {
			db.run('BEGIN IMMEDIATE TRANSACTION');
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
 * Get all rows from section table
 * @param {int} status
 * @param {function} callback
 */
function GetSectionStatusDB(status, callback) {
	let db = GetDB();
	db.all(
		`SELECT id_section,name,description,is_deleted FROM section WHERE is_deleted=?`,
		[status],
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
 * @param {String} description
 * @param {function} callback
 */
function UpdateSection(id_section, description, callback) {
	let db = GetDB();
	//db.run('BEGIN IMMEDIATE TRANSACTION');
	db.run(
		'UPDATE section SET description=? WHERE id_section=?',
		[description, id_section],
		function (err) {
			if (err) {
				return; //db.run('ROLLBACK');
			}
			db.all(
				'SELECT id_section,name,description,is_deleted FROM section',
				function (err, rows) {
					if (err) {
						return; //db.run('ROLLBACK');
					}
					//db.run('COMMIT');
					callback(rows);
				}
			);
		}
	);
}

/**
 * Change value for "is_deleted" whit a 0 or 1
 *
 * @param {number} id_section
 * @param {number} state
 * @param {function} callback
 */
function IsDeleteSectionDB(id_section, state, callback) {
	let db = GetDB();
	//db.run('BEGIN IMMEDIATE TRANSACTION');
	db.run(
		'UPDATE section SET is_deleted=? WHERE id_section=?',
		[state, id_section],
		function (err) {
			if (err) {
				return; //db.run('ROLLBACK');
			}
			db.all(
				'SELECT id_section,name,description,is_deleted FROM section',
				function (err, rows) {
					if (err) {
						return; //db.run('ROLLBACK');
					}
					//db.run('COMMIT');
					callback(rows);
				}
			);
		}
	);
}

function GetMenuSection(id_section, callback) {
	let db = GetDB();
	db.all(
		`SELECT DISTINCT m.id_menu,m.title as name, ifnull(ms.id_section,0) as id_section FROM menu m
			LEFT JOIN menu_section ms ON ms.id_menu=m.id_menu AND ms.id_section=?
			LEFT JOIN section s ON s.id_section=ms.id_section AND s.is_deleted=1 
			WHERE m.is_deleted=1`,
		[id_section],
		function (err, rows) {
			if (err) {
				return;
			}
			callback(rows);
		}
	);
}

function AddMenuSection(id_menu, id_section, callback) {
	let db = GetDB();
	//db.run('BEGIN IMMEDIATE TRANSACTION');
	db.run(
		`INSERT INTO menu_section(id_menu,id_section) VALUES(?,?)`,
		[id_menu, id_section],
		function (err) {
			if (err) {
				//return db.run('ROLLBACK');
			}
			db.all(
				`SELECT DISTINCT m.id_menu,m.title as name, ifnull(ms.id_section,0) as id_section FROM menu m
						LEFT JOIN menu_section ms ON ms.id_menu=m.id_menu AND ms.id_section=?
						LEFT JOIN section s ON s.id_section=ms.id_section AND s.is_deleted=1 
						WHERE m.is_deleted=1`,
				[id_section],
				function (err, rows) {
					if (err) {
						//return db.run('ROLLBACK');
					}
					//db.run('COMMIT');
					callback(rows);
				}
			);
		}
	);
}

function DeleteMenuSectionDB(id_menu, id_section, callback) {
	let db = GetDB();
	//db.run(`BEGIN IMMEDIATE TRANSACTION`);
	db.run(
		`DELETE FROM menu_section
		WHERE id_menu=? AND id_section=?`,
		[id_menu, id_section],
		function (err) {
			if (err) {
				return; //db.run('ROLLBACK');
			}
			db.all(
				`SELECT DISTINCT m.id_menu,m.title as name, ifnull(ms.id_section,0) as id_section FROM menu m
				LEFT JOIN menu_section ms ON ms.id_menu=m.id_menu AND ms.id_section=?
				LEFT JOIN section s ON s.id_section=ms.id_section AND s.is_deleted=1 
				WHERE m.is_deleted=1`,
				[id_section],
				function (err, rows) {
					if (err) {
						return; //db.run('ROLLBACK');
					}
					//db.run('COMMIT');
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
	IsDeleteSectionDB,
	GetSectionStatusDB,
	GetMenuSection,
	AddMenuSection,
	DeleteMenuSectionDB,
};
