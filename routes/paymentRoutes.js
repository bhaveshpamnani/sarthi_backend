const express = require("express");
const {getAllPaymentByUser,createPayment,updatePaymentStatus,cancelPayment} = require("../controller/paymentController");
const routes = express.Router();


routes.get("/getAll/:id",getAllPaymentByUser);

routes.post("/add",createPayment);

routes.put("/updatePaymentStatus/:id",updatePaymentStatus);

routes.delete("/cancel/:id",cancelPayment);

module.exports = routes;