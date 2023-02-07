const { response } = require('express');
const { AddItem } = require('./queryDB/kitchen');

const UploadFile = (req, res = response) => {
	const obj = req.body;
	let type = '.pxg';
	let url_image=""
	AddItem(obj.title, obj.description, obj.ingredients, obj.price, type,(cad)=>{
		url_image=cad
		console.log("dd",url_image) //aqui guardaremos la imagen en la carpeta uploads/imgMenu
		if (!req.files || Object.keys(req.files).length === 0) {
			//when no upload a file in body
			console.log('No se ha subido ningún archivo');
		} else {
			let image = req.files.image;
			//image.mv()
		}

	});
	res.status(200).send('Se ha recibido el objeto');
};

module.exports = {
	UploadFile,
};
