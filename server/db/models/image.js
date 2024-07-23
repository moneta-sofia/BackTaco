import mongoose from 'mongoose';
const { Schema } = mongoose;

const imageSchema = new Schema({
    url:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    description: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const Image = mongoose.model('Image',imageSchema);
export {Image};