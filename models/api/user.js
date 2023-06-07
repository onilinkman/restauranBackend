const bcrypt = require('bcrypt');
const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const {
	LoginUsernameDB,
	AddUserPersonalDB,
	GetAllPersonnelDB,
	UpdatePersonnelIsActiveDB,
	GetAccessModulePersonnelDB,
	AddAccessModulePersonnelDB,
	DeleteAccessModulePersonnelDB,
	AddBillClientDB,
	GetBillClientDB,
} = require('../queryDB/user');
const PUBLICKEY = '2H5dffn4.516Hrfg8GDc56@byfg55Rsb';

const generateJWT = (uuid = '') => {
	return new Promise((resolve, reject) => {
		const payload = { uuid };

		jwt.sign(
			payload,
			PUBLICKEY,
			{
				expiresIn: '18h',
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject('Error to generate token');
				} else {
					resolve(token);
				}
			}
		);
	});
};

const moduleRowsToArray = (arrObj = []) => {
	let newArr = [];
	for (let i = 0; i < arrObj.length; i++) {
		newArr.push(arrObj[i].nro_module);
	}
	return newArr;
};

const LoginUsername = async (req = request, res = response) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	let body = req.body;

	if (body) {
		await LoginUsernameDB(body.username, (err, rows) => {
			if (err) {
				res.sendStatus(503);
			} else {
				if (rows.length > 0) {
					bcrypt.compare(
						body.password,
						rows[0].password,
						async function (err, result) {
							if (err) {
								res.sendStatus(503);
							} else if (result) {
								const token = await generateJWT({
									id_user: rows[0].id_user,
									username: rows[0].username,
									id_rol: rows[0].id_rol,
									modules: moduleRowsToArray(rows),
								});
								res.status(200).json({
									username: rows[0].username,
									token,
								});
							} else {
								res.sendStatus(401);
							}
						}
					);
				} else {
					res.sendStatus(401);
				}
			}
		});
	} else {
		res.sendStatus(412);
	}
};

const addUser = (body, id_rol, callback) => {
	bcrypt
		.hash(body.password, 10)
		.then((hash) => {
			let user = {
				username: body.username,
				password: hash,
				first_names: body.first_names,
				p_lastname: body.p_lastname,
				m_lastname: body.m_lastname,
				ci: body.ci,
				email: body.email,
				id_rol,
			};
			AddUserPersonalDB(user, (err) => {
				callback(err, { msg: 'error to insert in database', err });
			});
		})
		.catch((err) => {
			callback(err, { msg: 'error to try encrypt password', err });
		});
};

const AddUserPersonal = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		addUser(body, 2, (err, obj) => {
			if (err) {
				res.status(409).json(obj);
			} else {
				res.status(201).json({ msg: 'User add is success' });
			}
		});
	} else {
		res.sendStatus(412);
	}
};

const AddUserClient = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		addUser(body, 3, (err, obj) => {
			if (err) {
				res.status(409).json(obj);
			} else {
				res.status(201).json({ msg: 'User add is success' });
			}
		});
	} else {
		res.sendStatus(412);
	}
};

const GetAllPersonnel = (req = request, res = response) => {
	GetAllPersonnelDB(2, (err, rows) => {
		if (err) {
			res.sendStatus(500);
		} else {
			res.json({
				msg: 'Get users is complete',
				data: rows,
			});
		}
	});
};

const GetAllClient = (req = request, res = response) => {
	GetAllPersonnelDB(3, (err, rows) => {
		if (err) {
			res.sendStatus(500);
		} else {
			res.json({
				msg: 'Get users is complete',
				data: rows,
			});
		}
	});
};

const UpdatePersonnelIsActive = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		UpdatePersonnelIsActiveDB(body.idUser, body.isActive, (err) => {
			if (err) {
				res.status(501).json({
					msg: 'Update Failed',
					err,
				});
			} else {
				res.json({
					msg: 'Update Complete',
				});
			}
		});
	} else {
		res.sendStatus(412);
	}
};

const GetAccessModulePersonnel = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		GetAccessModulePersonnelDB(body.id_user, (err, rows) => {
			if (err) {
				res.status(409).json({
					msg: 'error to get Access Module Personnel',
					err,
				});
			} else {
				res.json(rows);
			}
		});
	} else {
		res.sendStatus(412);
	}
};

const AddAccessModulePersonnel = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		AddAccessModulePersonnelDB(body.id_user, body.nro_module, (err) => {
			if (err) {
				res.status(501).json({
					msg: 'error to insert access module',
					err,
				});
			} else {
				res.sendStatus(200);
			}
		});
	} else {
		res.sendStatus(412);
	}
};

const DeleteAccessModulePersonnel = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		DeleteAccessModulePersonnelDB(body.id_user, body.nro_module, (err) => {
			if (err) {
				res.status(501).json({
					msg: 'error to delete access module',
					err,
				});
			} else {
				res.sendStatus(200);
			}
		});
	} else {
		res.sendStatus(412);
	}
};

const AddBillClient = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		AddBillClientDB(body.id_user, (err) => {
			//el id obtener del JWT
			if (err) {
				res.status(501).json({
					msg: 'error to insert add bill client',
					err,
				});
			} else {
				res.sendStatus(200);
			}
		});
	} else {
		res.sendStatus(412);
	}
};

const GetBillClientOpen = (req = request, res = response) => {
	let uuid = jwt.decode(req.header('x-token'))?.uuid;
	if (uuid && uuid?.id_user) {
		GetBillClientDB(uuid.id_user, 1, 1, (err, rows) => {
			if (err) {
				res.status(501).json({
					msg: 'error to get bill client open',
					err,
				});
			} else {
				res.status(200).json({
					msg: 'get bill is successfull',
					data: rows,
				});
			}
		});
	} else {
		res.sendStatus(412);
	}
};

module.exports = {
	LoginUsername,
	AddUserPersonal,
	GetAllPersonnel,
	GetAllClient,
	UpdatePersonnelIsActive,
	GetAccessModulePersonnel,
	AddAccessModulePersonnel,
	DeleteAccessModulePersonnel,
	AddUserClient,
	AddBillClient,
	GetBillClientOpen,
};
