const jwt = require('jsonwebtoken');

const isAutorize = (id_rol, arr = [], access) => {
	return id_rol === 1 || arr.some((element) => element === access);
};

const autorized = (req, res, next, access) => {
	let user = req.user;
	if (isAutorize(user.uuid.id_rol, user.uuid?.modules, access)) {
		next();
	} else {
		res.status(401).send('Unauthorized');
	}
};

const autorizePersonal = (req, res, next) => {
	autorized(req, res, next, 5);
};

const autorizeMesa = (req, res, next) => {
	autorized(req, res, next, 2);
};

module.exports = {
	autorizePersonal,
	autorizeMesa,
};
