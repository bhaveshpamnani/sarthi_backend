const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://bhaveshpamnani100:bhavesh1A@sarthi.kkna6.mongodb.net/?retryWrites=true&w=majority&appName=sarthi";

// Middleware to parse JSON
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error: " + err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist",wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/categories", categoryRoutes); 
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
