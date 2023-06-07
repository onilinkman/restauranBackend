const { GetDB } = require('../database');

function LoginUsernameDB(username, callback) {
	db = GetDB();
	if (db) {
		db.all(
			`SELECT DISTINCT u.id_user,u.username,u.password,u.id_rol,am.nro_module FROM user u
			INNER JOIN rol_user ru ON ru.id_rol=u.id_rol 
			AND u.username=? AND u.is_active=1
			LEFT JOIN access_module am ON am.id_user=u.id_user `,
			[username],
			(err, rows) => {
				callback(err, rows);
			}
		);
	}
}

function AddUserPersonalDB(user, callback) {
	db = GetDB();
	if (db) {
		db.run(
			`INSERT INTO user(username,password,first_names,p_lastname,m_lastname,ci,email,id_rol,is_active) VALUES (?,?,?,?,?,?,?,?,1)`,
			[
				user.username,
				user.password,
				user.first_names,
				user.p_lastname,
				user.m_lastname,
				user.ci,
				user.email,
				user.id_rol,
			],
			(err) => {
				callback(err);
			}
		);
	}
}

function GetAllPersonnelDB(id_rol, callback) {
	let db = GetDB();
	if (db) {
		db.all(
			`SELECT id_user,username,first_names,p_lastname,m_lastname,ci,email,date_register,id_rol,is_active FROM user
			WHERE id_rol=?`,
			[id_rol],
			(err, rows) => {
				callback(err, rows);
			}
		);
	}
}

function UpdatePersonnelIsActiveDB(idUser, isActive, callback) {
	let db = GetDB();
	if (db) {
		db.run(
			`UPDATE user SET is_active=? WHERE id_user=?`,
			[isActive, idUser],
			(err) => {
				callback(err);
			}
		);
	}
}

function GetAccessModulePersonnelDB(id_user, callback) {
	let db = GetDB();
	if (db) {
		db.all(
			`SELECT id_user, nro_module FROM access_module
			WHERE id_user=?`,
			[id_user],
			(err, rows) => {
				callback(err, rows);
			}
		);
	}
}

function AddAccessModulePersonnelDB(id_user, nro_module, callback) {
	let db = GetDB();
	if (db) {
		db.run(
			`INSERT INTO access_module (id_user,nro_module) VALUES (?,?)`,
			[id_user, nro_module],
			(err) => {
				callback(err);
			}
		);
	}
}

function DeleteAccessModulePersonnelDB(id_user, nro_module, callback) {
	let db = GetDB();
	if (db) {
		db.run(
			`DELETE FROM access_module
		WHERE id_user=? AND nro_module=?`,
			[id_user, nro_module],
			(err) => {
				callback(err);
			}
		);
	}
}

function AddBillClientDB(id_user, callback) {
	let db = GetDB();
	if (db) {
		db.run(
			`INSERT INTO bill_client(id_user,id_state,is_deleted) 
		VALUES (?,1,1)`,
			[id_user],
			(err) => {
				callback(err);
			}
		);
	}
}

function GetBillClientDB(id_user, id_state, is_deleted, callback) {
	let db = GetDB();
	if (db) {
		db.all(
			`SELECT id_bill_client,date FROM bill_client
		WHERE id_user=? AND id_state=? AND is_deleted=?`,
			[id_user, id_state, is_deleted],
			(err, rows) => {
				callback(err, rows);
			}
		);
	}
}

module.exports = {
	LoginUsernameDB,
	AddUserPersonalDB,
	GetAllPersonnelDB,
	UpdatePersonnelIsActiveDB,
	GetAccessModulePersonnelDB,
	AddAccessModulePersonnelDB,
	DeleteAccessModulePersonnelDB,
	AddBillClientDB,
	GetBillClientDB,
};
