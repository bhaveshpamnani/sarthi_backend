const express = require("express");
const {createCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory} = require("../controller/categoryController");
const routes = express.Router();

// Route to create a category
routes.post("/add", createCategory);

// Route to get all categories
routes.get("/getAll", getAllCategories);

// Route to get a specific category by ID
routes.get("/getById/:id", getCategoryById);

// Route to update a category by ID
routes.put("/update/:id", updateCategory);

// Route to delete a category by ID
routes.delete("/delete/:id", deleteCategory);
module.exports = routes;

