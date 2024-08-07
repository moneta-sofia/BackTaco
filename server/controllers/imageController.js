import { Category } from '../db/models/category.js';
import { Image } from '../db/models/image.js';
import { storage } from '../src/config/firebase.config.js';
import {ObjectId} from 'mongodb'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

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
	const { name, description, position } = req.body;
	const file = req.file;
	const { categoryName } = req.params;

	if (!file) {
		return res.status(400).send('No file uploaded.');
	}

	try {
		const category = await Category.findOne({ name: categoryName });
		const categoryId = category._id;
		if (!category) {
			return res.status(404).send('Cannot upload an image if the category does not exist');
		}

		const storageRef = ref(storage, `files/${categoryName}/${name + Date.now()}`);
		const metadata = {
			contentType: file.mimetype,
		};
		const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
		const downloadURL = await getDownloadURL(snapshot.ref);
		console.log('File successfully uploaded.');

		await updateImagesPositionPost(position, categoryId);
		const newImage = new Image({ url: downloadURL, name, description, position, categoryId });
		await newImage.save();
		res.status(201).send(newImage);
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
	const { name, description, position } = req.body;
	try {
		const image = await Image.findById(idImage);
		if (!image) {
			return res.status(404).send('Image not found');
		}
		await updateImagesPositionUpdate(image.position, position, image.categoryId);
		const updatedImage = await Image.findByIdAndUpdate(
			idImage,
			{ name, description, position },
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
        const bulkOps = updatedImages.map(({ _id, position }) => (
            {   updateOne: {
                filter: { _id: {_id} },
                update: { $set: {position} }
            }
        }));

        const result = await Image.bulkWrite(bulkOps);		
        res.status(200).send("Positions edited successfully " + JSON.stringify(result));	
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating image positions');
    }
}

export async function deleteImage(req, res) {
	const { idImage } = req.params;
	try {
		const image = await Image.findById(idImage);
		if (!image) {
			return res.status(404).send('Image not found');
		}

		const filePath = image.url.split('/o/')[1].split('?')[0];
		const desertRef = ref(storage, decodeURIComponent(filePath));
		await deleteObject(desertRef);
		await updateImagesPositionDelete(image);

		const result = await Image.findByIdAndDelete(idImage);
		res.send('Image deleted: ' + result);
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
