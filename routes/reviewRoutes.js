const express = require("express");
const routes = express.Router();
const { createReview,getReviews,updateReview,deleteReview} = require("../controller/reviewController");

routes.get('/getAllReview',getReviews);

routes.post('/createReview',createReview);

routes.put('/updateReview',updateReview);

routes.delete('/deleteReview',deleteReview);

module.exports = routes;