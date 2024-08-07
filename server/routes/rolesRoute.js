import express from 'express';
import db from '../db/connection.js';
import { createRol, deleteRol } from '../controllers/rolController.js';

const router = express.Router();

router.post('/', createRol);
router.delete('/', deleteRol);

export default router;
