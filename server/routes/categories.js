import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";
import { Category } from '../models/category.js';

const app = express();
app.use(express.json());
const router = express.Router();

router.get("/", async (req, res) => {
  try{
    const categories = await Category.find();
    const categoriesPlain = categories.map(category => category.toObject());
    res.send(categoriesPlain).status(200);
    }catch(err){
      console.error(err);
      res.status(500).send("Error fetching records");
    }
  });



  router.post("/", async (req, res) => {
    const {name} = req.body;
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
    const {name} = req.params;

    try {
      const existingCategory = await Category.findOneAndDelete({ name });
      res.status(201).send("Category deleted!");
    }catch (err) {
      console.log(err);
      res.status(500).send("Error deleting record");
    }
  })


  export default router;