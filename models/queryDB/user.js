const { GetDB } = require('../database');

function LoginUsernameDB(username, callback) {
	db = GetDB();
	if (db) {
		db.all(
			`SELECT u.id_user,u.username,u.password,u.id_rol FROM user u
        INNER JOIN rol_user ru ON ru.id_rol=u.id_rol AND username=? `,
			[username],
			(err,rows) => {
				callback(err,rows);
			}
		);
	}
}

module.exports = {
	LoginUsernameDB,
};
