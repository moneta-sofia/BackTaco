import express from "express";
import cors from "cors";
import category from "./routes/categoriesRoute.js";
import images from "./routes/imagesRoute.js";
import dotenv from "dotenv"
dotenv.config();
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/categories", category);
app.use("/images", images);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});