const Cart = require("../model/cart");
const Product = require("../model/product");

///---====Calculate cart total price and total quantity---====////
// Function to calculate total quantity and price
function calculateCartTotal(cart) {
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    

    cart.items.forEach((item) => {
        // Ensure item has a quantity and price before calculating
        const itemQuantity = item.quantity || 0;
        const itemPrice = item.product?.price || 0; // Optional chaining for safety

        cart.totalQuantity += itemQuantity;
        cart.totalPrice += itemQuantity * itemPrice;
    });
}

///---====Add or update item in the cart---====////
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, totalPrice, size, color } = req.body;

    // Validate quantity
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).send({ message: "Invalid quantity" });
    }

    // Validate totalPrice and ensure it's a valid number
    if (isNaN(totalPrice) || totalPrice <= 0) {
      console.log("Invalid totalPrice:", totalPrice); // Log invalid totalPrice for debugging
      return res.status(400).send({ message: "Invalid total price" });
    }

    // Validate size and color
    if (!size || !color) {
      return res.status(400).send({ message: "Size and color are required" });
    }

    // Find the product and check if it exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product with the same size and color is already in the cart
    const itemIndex = cart.items.findIndex(item => 
      item.product._id.toString() === productId && item.size === size && item.color === color
    );

    if (itemIndex === -1) {
      // If product with the same size and color is not in the cart, add it
      cart.items.push({ 
        product: productId, 
        quantity, 
        totalPrice: parseFloat(totalPrice), 
        size, 
        color 
      });
    } else {
      // If product with the same size and color already exists, update its quantity and totalPrice
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].totalPrice = parseFloat(totalPrice); // Update totalPrice with the passed value
      cart.items[itemIndex].size = size;  // Update size
      cart.items[itemIndex].color = color;  // Update color

      // Remove item if quantity is less than 1
      if (cart.items[itemIndex].quantity < 1) {
        cart.items.splice(itemIndex, 1);
      }
    }

    // Recalculate total price and total quantity for the cart
    calculateCartTotal(cart);

    // Save the cart with updated items
    await cart.save();

    // Respond with the updated cart
    res.status(201).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//   try {
//     const { userId, productId, quantity, size } = req.body;

//     // Validate that the size is provided
//     if (!size) {
//       return res.status(400).json({ message: "Size is required" });
//     }

//     // Fetch the product to get its price
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Calculate the total price (product price * quantity)
//     const totalPrice = product.price * quantity;

//     // Find or create the user's cart
//     let cart = await Cart.findOne({ user: userId }).populate('items.product');
//     if (!cart) {
//       cart = new Cart({ user: userId, items: [] });
//     }

//     // Check if the product with the same size already exists in the cart
//     const itemIndex = cart.items.findIndex(
//       (item) => item.product._id.toString() === productId && item.size === size
//     );

//     if (itemIndex === -1) {
//       // If the product with that size is not in the cart, add it
//       cart.items.push({ product: productId, size, quantity, totalPrice });
//     } else {
//       // If the product with that size already exists, update the quantity and total price
//       cart.items[itemIndex].quantity += quantity;
//       cart.items[itemIndex].totalPrice = totalPrice; // Update the total price
//     }

//     // Recalculate total quantity and price for the cart
//     calculateCartTotal(cart);

//     // Save the cart with updated items
//     await cart.save();

//     // Respond with the updated cart
//     res.status(201).json({ message: "Product added to cart", cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };







///---====Remove item or decrease quantity from cart---====////
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId  ,size,color, totalPrice} = req.body;

        // Find user's cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        // Find the product in the cart
        const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        // Decrease quantity or remove item if quantity is 1
        cart.items[itemIndex].quantity -= 1;
        cart.totalQuantity -= 1;
        cart.totalPrice = totalPrice;
        cart.items[itemIndex].size = size;
        cart.color = color;
        if (cart.items[itemIndex].quantity < 1) {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

///---====Get user's cart---====////
exports.getCart = async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch the cart with populated product details
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart is empty" });

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

///---====Clear user's cart---====////
exports.clearCart = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart is empty" });

        // Clear items and reset totals
        cart.items = [];
        cart.totalQuantity = 0;
        cart.totalPrice = 0;

        await cart.save();
        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};