const { request, response } = require('express');

const { GetIdsMenuBySectionDB } = require('../queryDB/menu');

function GetIdsMenuBySection(req = request, res = response) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	let id_section = req.query?.id_section;
	if (id_section) {
		GetIdsMenuBySectionDB(id_section, (err, rows) => {
			if (err) {
				return res.sendStatus(500);
			} else {
				res.json(rows);
			}
		});
	} else {
		res.sendStatus(406);
	}
}

module.exports = {
	GetIdsMenuBySection,
};
