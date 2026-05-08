import { Category } from '../db/models/category.js';
import { Image } from '../db/models/image.js';
import { ObjectId } from 'mongodb'
import { supabase, SUPABASE_BUCKET } from '../src/config/supabase.config.js';
// import { storage } from '../src/config/firebase.config.js';
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';


function sanitizeFileName(name) {
	return name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-_]/g, '');
}
function getFileExtension(mimetype) {
	const extensions = {
		'image/jpeg': 'jpg',
		'image/jpg': 'jpg',
		'image/png': 'png',
		'image/webp': 'webp',
		'image/gif': 'gif',
	};

	return extensions[mimetype] || 'jpg';
}
export async function getAllImagesByCategory(req, res) {
	const { categoryName } = req.params;
	try {
		const category = await Category.findOne({ name: categoryName });
		if (!category) {
			return res.status(404).send('Category not found');
		}

		const images = await Image.find({ categoryId: category._id }).sort({ position: 1 });
		res.send(images);
	} catch (error) {
		console.error(error);
		res.status(500).send('Error getting images');
	}
}

export async function postImage(req, res) {
	const { name, descriptionESP, descriptionENG, position, urlVideo } = req.body;
	const file = req.file;
	const { categoryName } = req.params;

	if (!position) {
		return res.status(400).send('Position is required');
	}
	if (!name) {
		return res.status(400).send('Position is required');
	}

	if (!file && !urlVideo) {
		return res.status(400).send('No file or video uploaded.');
	}

	try {
		const category = await Category.findOne({ name: categoryName });
		if (!category) {
			return res.status(404).send('Cannot upload an image if the category does not exist');
		}
		const categoryId = category._id;
		if (file) {

			const extension = getFileExtension(file.mimetype);
			const safeName = sanitizeFileName(name);

			const filePath = `files/${categoryName}/${safeName}-${Date.now()}.${extension}`;


			const metadata = {
				contentType: file.mimetype,
			};

			const { data } = supabase.storage
				.from(SUPABASE_BUCKET)
				.getPublicUrl(filePath);
			const downloadURL = data.publicUrl;

			await updateImagesPositionPost(position, categoryId);
			const newImage = new Image({ url: downloadURL, name, descriptionESP, descriptionENG, position, categoryId });
			await newImage.save();
			res.status(201).send(newImage);
		} else if (urlVideo) {
			await updateImagesPositionPost(position, categoryId);
			const newImage = new Image({ url: urlVideo, name, descriptionESP, descriptionENG, position, categoryId });
			await newImage.save();
			res.status(201).send(newImage);
		}

	} catch (err) {
		console.error(err);
		res.status(500).send('Error posting image');
	}
}

async function updateImagesPositionPost(initialPosition, categoryId) {
	try {
		// const images = await Image.find({ categoryId: categoryId }).sort({ position: 1 });
		await Image.updateMany({ categoryId, position: { $gte: initialPosition } }, { $inc: { position: +1 } });
	} catch (error) {
		console.error(error);
		console.log('Error updating positions');
	}
}

export async function updateImage(req, res) {
	const { idImage } = req.params;
	const { name, descriptionESP, descriptionENG, position } = req.body;
	try {
		const image = await Image.findById(idImage);
		if (!image) {
			return res.status(404).send('Image not found');
		}
		await updateImagesPositionUpdate(image.position, position, image.categoryId);
		const updatedImage = await Image.findByIdAndUpdate(
			idImage,
			{ name, descriptionESP, descriptionENG, position },
			{ new: true, runValidators: true } // Opciones para devolver el documento actualizado y ejecutar validadores
		);
		res.send(updatedImage);
	} catch (error) {
		console.error(error);
		console.log('Error updating positions');
	}
}

async function updateImagesPositionUpdate(initialPosition, finalPosition, categoryId) {
	try {
		if (initialPosition === finalPosition) {
			return;
		}

		if (initialPosition < finalPosition) {
			await Image.updateMany({ categoryId, position: { $gte: initialPosition + 1, $lte: finalPosition } }, { $inc: { position: -1 } });
		} else {
			await Image.updateMany({ categoryId, position: { $gte: finalPosition, $lt: initialPosition } }, { $inc: { position: 1 } });
		}
	} catch (error) {
		console.error(error);
		console.log('Error updating positions');
	}
}

export async function updateAllImagesPosition(req, res) {
	const { categoryName } = req.params;
	const updatedImages = req.body;
	try {
		const category = await Category.findOne({ name: categoryName });
		if (!category) {
			return res.status(404).send('Category not found');
		}
		let arrayUpdateImage = Object.values(updatedImages)
		const bulkOps = arrayUpdateImage.map(({ _id, position }) => (
			{
				updateOne: {
					filter: { _id: { _id } },
					update: { $set: { position } }
				}
			}));

		const result = await Image.bulkWrite(bulkOps);
		res.status(200).send("Positions edited successfully " + JSON.stringify(result));

	} catch (error) {
		console.error(error);
		res.status(500).send('Error updating image positions');
	}
}

function getSupabasePathFromUrl(url) {
	const marker = `/storage/v1/object/public/${SUPABASE_BUCKET}/`;
	return url.split(marker)[1];
}

export async function deleteImage(req, res) {
	const { idImage } = req.params;
	try {
		const image = await Image.findById(idImage);
		if (!image) {
			return res.status(404).send('Image not found');
		}
		if (image.url.includes('https://www.youtube.com/') || image.url.includes('https://youtu.be/')) {
			await updateImagesPositionDelete(image);
			const result = await Image.findByIdAndDelete(idImage);
			res.send('Image deleted: ' + result);
			return
		} else {
			
			const filePath = image.storagePath || getSupabasePathFromUrl(image.url);

			if (!filePath) {
				console.log('No Supabase file path found for image:', image.url);
				return;
			}

			await supabase.storage.from(SUPABASE_BUCKET).remove([filePath]);
			await updateImagesPositionDelete(image);

			const result = await Image.findByIdAndDelete(idImage);
			res.send('Deleted: ' + result);
			return
		}

	} catch (error) {
		console.error(error);
		res.status(500).send('Error deleting image');
	}
}
async function updateImagesPositionDelete(image) {
	try {
		const categoryId = image.categoryId;
		await Image.updateMany({ categoryId, position: { $gte: image.position } }, { $inc: { position: -1 } });
	} catch (error) {
		console.error(error);
	}
}
