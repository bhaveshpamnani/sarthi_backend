const express = require("express");
const {createOrder,updateOrderStatus,cancelOrder,updateShippingAddress,getAllOrder} = require('../controller/orderController');
const routes = express.Router();

routes.get('/getAll/:id',getAllOrder);

routes.post('/add',createOrder);

routes.put('/updateStatus/:id',updateOrderStatus);

routes.put('/updateShippingAddress/:id',updateShippingAddress);

routes.delete('/cancle/:id',cancelOrder);

module.exports = routes;