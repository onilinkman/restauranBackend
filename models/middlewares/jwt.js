const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const PUBLICKEY = '2H5dffn4.516Hrfg8GDc56@byfg55Rsb';

const validateJWT = (req = request, res = response, next) => {
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			msg: 'no token in request',
		});
	}
	try {
		const user = jwt.verify(token, PUBLICKEY);
		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({
			msg: 'error in token',
			error,
		});
	}
};

module.exports = {
	validateJWT,
	PUBLICKEY,
};
