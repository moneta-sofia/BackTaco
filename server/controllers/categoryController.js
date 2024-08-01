import { Category } from '../db/models/category.js';


export async function getAllCategories(req, res) {
    try {
        const categories = await Category.find();
        const categoriesPlain = categories.map(category => category.toObject());
        res.send(categoriesPlain).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching category");
    }
}

export async function getCategoryByName(req, res) {
    const { name } = req.params;
    try {
        const category = await Category.findOne({ name })
        if (!category) {
            return res.status(404).send("Category not found");
        }
        res.status(200).send(category);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error getting category");
    }
}

export async function createCategory(req, res) {
    const { name } = req.body;
    try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).send("Category already exists");
        }
        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).send(newCategory);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding category");
    }
}

export async function deleteCategoryByName(req, res) {
    const { name } = req.params;
    try {
        const existingCategory = await Category.findOneAndDelete({ name });
        res.status(200).send("Category deleted!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting record");
    }
}