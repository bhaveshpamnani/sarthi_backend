const Cart = require("../model/cart");
const Product = require("../model/product");

///---====Calculate cart totalprice and totalquantity---====////
// Function to calculate total quantity and price
function calculateCartTotal(cart) {
    cart.totalQuantity = 0;
    cart.totalPrice = 0;

    cart.items.forEach((item) => {
        // Ensure item has a quantity and price before calculating
        const itemQuantity = item.quantity || 0;
        const itemPrice = item.product.price || 0;

        cart.totalQuantity += itemQuantity;
        cart.totalPrice += itemQuantity * itemPrice;
    });
}



///---====Cart Add or update item---====////
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Find the product and check if it exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Find or create the user's cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if the product is already in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            // If product not in cart, add it with quantity
            cart.items.push({ product: productId, quantity });
        } else {
            // If product already in cart, update its quantity
            cart.items[itemIndex].quantity += quantity;
            if (cart.items[itemIndex].quantity < 1) {
                cart.items.splice(itemIndex, 1); // Remove if quantity is less than 1
            }
        }

        // Calculate total quantity and price
        let totalQuantity = 0;
        let totalPrice = 0;

        for (const item of cart.items) {
            // Fetch the price of each product in the cart for accuracy
            const productDetails = await Product.findById(item.product);
            if (productDetails) {
                totalQuantity += item.quantity;
                totalPrice += item.quantity * productDetails.price;
            }
        }

        // Update cart totals
        cart.totalQuantity = totalQuantity;
        cart.totalPrice = totalPrice;

        await cart.save();
        res.status(201).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


///---====Cart item remove---====////
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Find user's cart
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) return res.status(404).send({ message: "Cart not found" });

        // Find the index of the product in the cart items
        const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).send({ message: "Product not found in cart" });
        }

        // Decrease the quantity of the product
        if (cart.items[itemIndex].quantity >= 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            // If quantity is 1, remove the item from the cart
            cart.items.splice(itemIndex, 1);
        }

        // Recalculate the total price and quantity for the cart
        calculateCartTotal(cart);

        await cart.save();
        res.status(200).json({ message: "Product quantity updated in cart", cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error ::" });
    }
};

//---====Get cart of the user====---//
exports.getCart = async(req,res)=>{
    try{
        const userId = req.params.id;

        const cart = await Cart.findOne({user:userId});

        if(!cart) return res.status(404).json({message:"Cart is ematy"});

        res.status(200).json(cart);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error ::"});
    }
}

//---====Clear cart of the user====---//
exports.clearCart = async(req,res)=>{
    try{
        const userId = req.params.id;
        console.log(userId);
        const cart = await Cart.findOne({user:userId});
        if(!cart) return res.status(404).json({message:"Cart is empty"});
        cart.items = [];
        cart.totalQuantity = 0;
        cart.totalPrice = 0;
        await cart.save();
        res.status(200).json({message:"Cart cleared",cart});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error ::"});
    }
}