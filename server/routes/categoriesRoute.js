import express from "express";
import db from "../db/connection.js";
import { createCategory, deleteCategoryByName, getAllCategories, getCategoryByName } from "../controllers/categoryController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";


const router = express.Router();


router.get("/", getAllCategories);

router.get("/:name", getCategoryByName );

router.post("/",authenticate, authorize('admin'), createCategory);

router.delete("/:name",authenticate, authorize('admin'), deleteCategoryByName);


export default router;