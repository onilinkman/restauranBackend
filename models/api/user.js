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
	}
};

const AddUserPersonal = (req = request, res = response) => {
	let body = req.body;
	if (body) {
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
				};
				AddUserPersonalDB(user, (err) => {
					if (err) {
						res.status(409).json({
							msg: 'error to insert in database',
							err,
						});
					} else {
						res.status(201).json({ msg: 'User add is success' });
					}
				});
			})
			.catch((err) => {
				res.status(409).json({
					msg: 'error to try encrypt password',
					err,
				});
			});
	}
};

const GetAllPersonnel = (req = request, res = response) => {
	GetAllPersonnelDB((err, rows) => {
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
	}
};

module.exports = {
	LoginUsername,
	AddUserPersonal,
	GetAllPersonnel,
	UpdatePersonnelIsActive,
	GetAccessModulePersonnel,
	AddAccessModulePersonnel,
	DeleteAccessModulePersonnel,
};
