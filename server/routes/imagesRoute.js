import express from 'express';
import db from '../db/connection.js'
import { deleteImage, getAllImagesByCategory, postImage, updateImage } from '../controllers/imageController.js';
import { upload } from '../middleware/multerConfig.js';

const app = express();
app.use(express.json());
const router = express.Router();

router.get('/:categoryName', getAllImagesByCategory)
router.post("/:categoryName",upload.single("filename"),  postImage)
router.put('/:categoryName/:idImage', updateImage)
router.delete('/:categoryName/:idImage', deleteImage)


export default router;