const { request, response } = require('express');

const { AddMesaDB, AddFloorDB, AddFloorsTableDB } = require('../queryDB/mesas');

const AddMesa = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		AddMesaDB(body.name, (err) => {
			if (err) {
				res.status(409).json({ msg: 'Error to insert Mesa', err });
			} else {
				res.sendStatus(201);
			}
		});
	} else {
		res.status(412).json({ msg: 'Body is undefined' });
	}
};

const AddFloor = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		AddFloorDB(body.title, body.description, (err) => {
			if (err) {
				res.status(409).json({ msg: 'Error to insert floors', err });
			} else {
				res.sendStatus(201);
			}
		});
	} else {
		res.status(412).json({ msg: 'Body is undefined' });
	}
};

const AddFloorsTable = (req = request, res = response) => {
	let body = req.body;
	if (body) {
		AddFloorsTableDB(body.id_floor, body.id_table, (err) => {
			if (err) {
				res.status(409).json({
					msg: 'Error to insert floor_table',
					err,
				});
			} else {
				res.sendStatus(201);
			}
		});
	} else {
		res.status(412).json({ msg: 'Body is undefined' });
	}
};

module.exports = {
	AddMesa,
	AddFloor,
	AddFloorsTable,
};
