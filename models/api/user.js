const bcrypt = require('bcrypt');
const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const { LoginUsernameDB } = require('../queryDB/user');
const PUBLICKEY='2H5dffn4.516Hrfg8GDc56@byfg55Rsb'

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
								const token =await generateJWT(rows[0]);
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

module.exports = {
	LoginUsername,
};
