const express = require("express");
const {addToCart,getCart,removeFromCart,clearCart} = require("../controller/cartController");
const routes = express.Router();


routes.post('/add',addToCart);

routes.get('/getAll/:id',getCart);

routes.put("/removeItem",removeFromCart);

routes.delete('/clear/:id',clearCart);

module.exports = routes;