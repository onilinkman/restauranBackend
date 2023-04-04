const { GetDB } = require('../database');

function GetIdsMenuBySectionDB(id_section, callback) {
	let db = GetDB();
	if (db) {
		db.all(
			`SELECT DISTINCT m.id_menu FROM menu m
        INNER JOIN menu_section ms ON m.id_menu=ms.id_menu 
        AND ms.id_section=?`,
			[id_section],
			function (err, rows) {
				callback(err, rows);
			}
		);
	}
}

module.exports = {
	GetIdsMenuBySectionDB,
};
