import express from 'express';
import db from '../db/connection.js'
import { deleteImage, getAllImagesByCategory, postImage, updateImage } from '../controllers/imageController.js';


const app = express();
app.use(express.json());
const router = express.Router();


router.get('/:categoryName', getAllImagesByCategory)
router.post("/:categoryName", postImage)
router.put('/:categoryName/:idImage', updateImage)
router.delete('/:categoryName/:idImage', deleteImage)


export default router;