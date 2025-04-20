import mongoose from 'mongoose';
const { Schema } = mongoose;

const imageSchema = new Schema({
	url: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	descriptionESP: String,
	descriptionENG: String,
	position: {
		type: Number,
		required: true,
	},
	categoryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
});

const Image = mongoose.model('Image', imageSchema);
export { Image };
