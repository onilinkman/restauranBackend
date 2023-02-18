const { request, response } = require('express');
const {
	AddSection,
	GetSectionDB,
	UpdateSection,
} = require('../queryDB/kitchen');

function PostSection(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	const body = req.body;
	if (body) {
		AddSection(body.name, body.description, () => {
			res.sendStatus(200);
		});
	} else {
		res.sendStatus(500);
	}
}

function GetSection(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	GetSectionDB((rows) => {
		res.json(rows);
	});
}

function PutSection(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	const body = req.body;
	if (body) {
		UpdateSection(body.id_section, body.name, body.description, (rows) => {
			res.json(rows);
		});
	} else {
		res.sendStatus(500);
	}
}

module.exports = {
	PostSection,
	GetSection,
	PutSection,
};
