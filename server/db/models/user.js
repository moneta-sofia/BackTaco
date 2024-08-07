import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	user: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		ref: 'Role',
		type: Schema.Types.ObjectId,
	},
});

const User = mongoose.model('User', userSchema);
export { User };
