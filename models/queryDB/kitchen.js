const { GetDB } = require('../database');

const AddItem = (title, description, ingredients, price, type,callback) => {
	let db = GetDB();
	let url_image = '';
    var cad='';
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
                    cad=menuId + type
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
                            callback(cad)
						}
					);
				}
			);
		});
	}
};

module.exports = {
	AddItem,
};
