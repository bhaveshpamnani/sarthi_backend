const Product = require("../model/product");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, brand, discountPrice,
      mrpPrice,
      discount, stock, sku, images, sizes, colors, fabric, productReturnDay, isFeatured, isAvailable } = req.body;

    const newProduct = new Product({
      name,
      description,
      category,
      brand,
      discountPrice,
      mrpPrice,
      discount,
      stock,
      sku,
      images,
      sizes,
      colors,
      fabric,
      productReturnDay,
      isFeatured,
      isAvailable,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Products with populated category details
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get products by category ID
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log(categoryId);
    
    const products = await Product.find({ category: categoryId });

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.uploadImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    const imagePath = `/uploads/${req.file.filename}`;

    product.images.push({ url: imagePath, altText: req.body.altText || '' });
    await product.save();

    res.status(200).json({ message: "Image uploaded successfully", imagePath });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
};