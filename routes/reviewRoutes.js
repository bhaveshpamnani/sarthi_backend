const express = require("express");
const routes = express.Router();
const { createReview,getReviews,updateReview,deleteReview,getOverallRating} = require("../controller/reviewController");

routes.get('/getAllReview/:productId',getReviews);

routes.post('/createReview',createReview);

routes.put('/updateReview',updateReview);

routes.delete('/deleteReview',deleteReview);

routes.get('/overall/:productId', getOverallRating);

module.exports = routes;