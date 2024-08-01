import express from 'express';
import db from "../db/connection.js";
import { signin, signup } from '../controllers/authController.js';

const router = express.Router();

router.post('/signin',signin)
router.post('/signup', signup)

export default router;
