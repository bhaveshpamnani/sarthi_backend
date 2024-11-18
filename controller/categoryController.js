const Category = require("../model/category");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    // Create and save the category
    const category = new Category({ name, description, isActive });
    await category.save();

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, isActive } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};