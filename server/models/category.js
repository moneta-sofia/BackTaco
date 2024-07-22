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
    name: String
});

const categorySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    images: [imageSchema]
});

const Category = mongoose.model('Category', categorySchema);
export { Category, imageSchema };
