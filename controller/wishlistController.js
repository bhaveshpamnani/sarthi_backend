const product = require("../model/product");
const Wishlist = require("../model/wishlist");

///---=====Toggle the  Product in Wishlist---=====///
exports.toggleProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    // Find the user's wishlist
    let wishlist = await Wishlist.findOne({ user:userId });

    if (!wishlist) {
      // Create a new wishlist if it doesn't exist and add the product
      wishlist = new Wishlist({
        user: userId,
        items: [{ product: productId, isInWishlist: true }],
      });
      await wishlist.save();
      return res
        .status(201)
        .json({ message: "Product Add to wishlist ", wishlist });
    }

    // Find the index of the product in the wishlist
    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      ///If product is not in user wishlist then add it.
      wishlist.items.push({ product: productId, isInWishlist: true });
      await wishlist.save();
      return res
        .status(201)
        .json({ message: "Product Add to wishlist ", wishlist });
    } else {
      //If product in Users wishlist then toggle the product with (if product in wishlist then remove it).
      wishlist.items[itemIndex].isInWishlist =
        !wishlist.items[itemIndex].isInWishlist;

      // Optionally, remove the product if `isInWishlist` becomes false
      if (!wishlist.items[itemIndex].isInWishlist) {
        wishlist.items.splice(itemIndex, 1); // Remove item from wishlist
      }

      await wishlist.save();
      return res.status(200).json({ message: "Wishlist updated", wishlist });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error adding product to wishlist" });
  }
};

// Get the status of a product in the wishlist
exports.getWishlistStatus = async (req, res) => {
  try {
    const { userId, productId } = req.params; // Get userId and productId from URL params

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({ isInWishlist: false }); // No wishlist, product is not in wishlist
    }

    // Check if the product is in the wishlist
    const productInWishlist = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (productInWishlist) {
      return res.status(200).json({ isInWishlist: productInWishlist.isInWishlist });
    }

    return res.status(200).json({ isInWishlist: false }); // Product is not in the wishlist
  } catch (error) {
    console.error("Error fetching wishlist status:", error);
    return res.status(500).json({ message: "Error fetching wishlist status" });
  }
};


// Get User Wishlist
exports.getProductsByUser =  async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the wishlist by userId and populate the product details
    const wishlist = await Wishlist.findOne({ user: userId })
      .populate('items.product', 'name discountPrice images brand')  // Populate only needed fields from the Product model
      .exec();

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found for this user' });
    }

    // Return the populated wishlist
    res.status(200).json({
      wishlist: wishlist.items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        addedAt: item.addedAt,
        isInWishlist: item.isInWishlist
      }))
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'An error occurred while fetching the wishlist' });
  }
};
