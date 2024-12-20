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
        const { userId, productId, quantity, totalPrice } = req.body; // Added totalPrice to request body

        // Validate quantity
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).send({ message: "Invalid quantity" });
        }

        // Validate totalPrice
        if (isNaN(totalPrice) || totalPrice < 0) {
            return res.status(400).send({ message: "Invalid total price" });
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

        // Check if the product is already in the cart
        const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

        if (itemIndex === -1) {
            // If product not in cart, add it with quantity
            cart.items.push({ product: productId, quantity, totalPrice }); // Use the totalPrice passed from frontend
        } else {
            // If product already in cart, update its quantity and totalPrice
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].totalPrice = totalPrice; // Update totalPrice with the passed value
            if (cart.items[itemIndex].quantity < 1) {
                cart.items.splice(itemIndex, 1); // Remove if quantity is less than 1
            }
        }

        // Update cart totals directly from frontend data
        cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

        // Save the cart with updated totals
        await cart.save();
        res.status(201).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




///---====Remove item or decrease quantity from cart---====////
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId  , totalPrice} = req.body;

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
