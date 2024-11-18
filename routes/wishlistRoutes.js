const express = require("express");
const routes = express.Router();
const {toggleProduct,getWishlistStatus,getProductsByUser} = require("../controller/wishlistController");

routes.post("/toggle",toggleProduct);
routes.get('/status/:userId/:productId', getWishlistStatus);
routes.get('/product-by-user/:userId', getProductsByUser);

module.exports = routes;