const { request, response } = require('express');
const {
	AddSection,
	GetSectionDB,
	UpdateSection,
	IsDeleteSectionDB,
	GetSectionStatusDB,
	GetMenuSection,
	AddMenuSection,
	DeleteMenuSectionDB,
	GetMenuByIdDB,
	DeleteIngredientDB,
	InsertIngredientDB,
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

function GetMenuById(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');

	let id_menu = req.query?.id_menu;
	if (id_menu) {
		GetMenuByIdDB(id_menu, (rows) => {
			res.json(rows);
		});
	} else {
		res.sendStatus(406);
	}
}

function GetSection(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	GetSectionDB((rows) => {
		res.json(rows);
	});
}

function GetSectionNotDeleted(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	GetSectionStatusDB(1, (rows) => {
		res.json(rows);
	});
}

function PutSection(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	const body = req.body;
	if (body) {
		UpdateSection(body.id_section, body.description, (rows) => {
			res.json(rows);
		});
	} else {
		res.sendStatus(500);
	}
}

function DeleteSection(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	const body = req.body;
	if (body) {
		IsDeleteSectionDB(body.id_section, body.state, (rows) => {
			res.json(rows);
		});
	} else {
		res.sendStatus(500);
	}
}

function GetMenu_Section(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	let id_section = req.query?.id_section;
	if (id_section) {
		GetMenuSection(id_section, (rows) => {
			res.json(rows);
		});
	} else {
		res.sendStatus(500);
	}
}

function PostMenuSection(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	let body = req.body;
	if (body) {
		AddMenuSection(body.id_menu, body.id_section, (rows) => {
			res.json(rows);
		});
	} else {
		res.sendStatus(500);
	}
}

function DeleteMenuSection(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	let body = req.body;
	if (body) {
		DeleteMenuSectionDB(body.id_menu, body.id_section, (rows) => {
			res.json(rows);
		});
	} else {
		res.sendStatus(500);
	}
}

function DeleteIngredient(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	let body = req.body;
	if (body) {
		DeleteIngredientDB(body.id_ingredient, body.id_menu, (rows) => {
			res.json(rows);
		});
	} else {
		res.sendStatus(500);
	}
}

function InsertIngredient(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	let body = req.body;
	if (body) {
		InsertIngredientDB(body.id_menu, body.description, (rows) => {
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
	DeleteSection,
	GetSectionNotDeleted,
	GetMenu_Section,
	PostMenuSection,
	DeleteMenuSection,
	GetMenuById,
	DeleteIngredient,
	InsertIngredient,
};
