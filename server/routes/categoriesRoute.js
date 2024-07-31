import express from "express";
import db from "../db/connection.js";
import { createCategory, deleteCategoryByName, getAllCategories, getCategoryByName } from "../controllers/categoryController.js";


const router = express.Router();


router.get("/", getAllCategories);

router.get("/:name", getCategoryByName );

router.post("/", createCategory);

router.delete("/:name", deleteCategoryByName);


export default router;