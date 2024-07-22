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



  // router.post("/", async (req, res) => {
  //   try {
  //     let newDocument = {
  //       urlImagen: req.body.urlImagen,
  //       description: req.body.description,
  //     };
  //     let collection = await db.collection("categorys");
  //     let result = await collection.insertOne(newDocument);
  //     res.send(result).status(204);
  //   } catch (err) {
  //     console.error(err);
  //     console.log("--------------------------------");
  //     res.status(500).send("Error adding record");
  //   }
  // });






  export default router;