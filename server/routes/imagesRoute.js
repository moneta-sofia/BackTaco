import express from 'express';
import db from '../db/connection.js';
import { deleteImage, getAllImagesByCategory, postImage, updateImage, updateAllImagesPosition } from '../controllers/imageController.js';
import { upload } from '../middleware/multerConfig.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:categoryName', getAllImagesByCategory);
router.post('/:categoryName', authenticate, authorize('admin'), upload.single('filename'), postImage);
router.put('/:categoryName/:idImage', authenticate, authorize('admin'), updateImage);
router.put('/:categoryName/', authenticate, authorize('admin'), updateAllImagesPosition);
router.delete('/:idImage', authenticate, authorize('admin'), deleteImage);

export default router;
