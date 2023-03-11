const { response, request } = require('express');
const { AddItem, GetRecetasDB } = require('./queryDB/kitchen');
const { IsOffTransaction, SetTransaction } = require('./database');
const path = require('path');
const fs = require('fs');

const UploadFile = (req, res = response) => {
	if (IsOffTransaction()) {
		SetTransaction(false);
		const validedExtends = ['png', 'jpg', 'jpeg', 'gif'];

		const obj = req.body;
		let image = req.files?.image;
		let type = '';
		if (image) {
			let name = image.name;
			let ext = name.split('.');
			type = ext[ext.length - 1];
		}
		AddItem(
			obj.title,
			obj.description,
			obj.ingredients,
			obj.price,
			'.' + type,
			(cad) => {
				if (!req.files || Object.keys(req.files).length === 0) {
					//when no upload a file in body
					SetTransaction(true);
					return res.sendStatus(204);
				}

				if (!validedExtends.includes(type)) {
					SetTransaction(true);
					return res.sendStatus(204);
				}

				if (image) {
					let uploadPath = path.join(
						__dirname,
						'../uploads',
						'imgMenu',
						cad
					);

					image.mv(uploadPath, (err) => {
						SetTransaction(true);
						if (err) {
							return res.sendStatus(204);
						}

						res.status(200).json({
							msg: 'el archivo se subio a: ' + uploadPath,
						});
					});
				}
			}
		);
	} else {
		return res.sendStatus(503);
	}
};

const GetMenu = (req = request, res = response) => {
	let pathImagen = path.join(
		__dirname,
		'../uploads',
		'imgMenu',
		req.query.id + '.jpg'
	);
	let data = {
		name: 'nombre',
		image: null,
	};
	if (fs.existsSync(pathImagen)) {
		data.image = fs.readFileSync(pathImagen, 'base64');
	}
	res.json(data);
};

const GetRecetas = (req = request, res = response) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	GetRecetasDB((rows) => {
		let arrayRecetas = [];
		let receta = {
			id_menu: undefined,
			title: undefined,
			description: undefined,
			url_image: undefined,
			price: 0,
			ingredients: [],
		};
		for (let i = 0; i < rows.length; i++) {
			if (
				receta.id_menu === undefined ||
				rows[i].id_menu !== receta.id_menu
			) {
				if (receta.id_menu !== undefined) arrayRecetas.push(receta);

				receta = {
					id_menu: rows[i].id_menu,
					title: rows[i].title,
					description: rows[i].description,
					url_image: rows[i].url_image,
					price: rows[i].price,
					ingredients: [],
				};
				receta.ingredients.push({ description: rows[i].desc_ing });
			} else {
				receta.ingredients.push({ description: rows[i].desc_ing });
			}
		}
		arrayRecetas.push(receta);
		res.json(arrayRecetas);
	});
};

module.exports = {
	UploadFile,
	GetMenu,
	GetRecetas,
};
