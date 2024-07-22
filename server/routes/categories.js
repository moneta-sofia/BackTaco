import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import { Category } from '../models/category.js';



const app = express();
app.use(express.json());
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    const categoriesPlain = categories.map(category => category.toObject());
    res.send(categoriesPlain).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
});

router.get("/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const category = await Category.findOne({name})
    if(!category){
      return res.status(404).send("Category not found");
    }
    res.status(200).send(category);
  }catch (err) {
    console.error(err);
    res.status(500).send("Error getting category");
  }

})



router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    // Verificar si la categoría ya existe
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).send("Category already exists");
    }
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).send(newCategory);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});


router.delete("/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const existingCategory = await Category.findOneAndDelete({ name });
    res.status(201).send("Category deleted!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting record");
  }
})


export default router;