const Review = require("../model/review");
 const mongoose = require('mongoose');

////---====Create Review---====////
exports.createReview = async(req,res)=>{
    try{
        const {productId,userId,rating,comment} = req.body;

        const review = new Review({
            product:productId,
            user:userId,
            rating,
            comment
        });

        await review.save();
        return res.status(201).json({message:"Review is added ",review});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error : ",error});
    }
}

////---====Get All Review---====////
exports.getReviews = async(req,res)=>{
    try{
        const {productId} = req.params;
        const reviews = await Review.find({ product: productId }).populate('user', 'name');
        res.status(201).json(reviews);
        
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error : ",error});
    }
}

////---====Update Review---====////
exports.updateReview = async (req, res) => {
    try {
      const { reviewId } = req.body;
      const { rating, comment } = req.body;
  
      const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { rating, comment },
        { new: true, runValidators: true }
      );
  
      if (!updatedReview) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      res.status(200).json({ message: 'Review updated successfully', updatedReview });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating review', error });
    }
  };
  
 ////---====Delete Review---====////
  exports.deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.body;
  
      const deletedReview = await Review.findByIdAndDelete(reviewId);
      if (!deletedReview) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting review', error });
    }
  };

  ////---====Get Overall Rating and Rating Count====////
  exports.getOverallRating = async (req, res) => {
    try {
        const { productId } = req.params;

        // Ensure productId is converted to ObjectId
        const productObjectId = new mongoose.Types.ObjectId(productId);

        const result = await Review.aggregate([
            { $match: { product: productObjectId } }, // Match reviews for the product
            {
                $group: {
                    _id: "$rating", // Group by rating
                    count: { $sum: 1 }, // Count reviews for each rating
                }
            },
            { $sort: { _id: 1 } } // Sort by rating (1-5)
        ]);

        // Calculate overall rating
        const totalReviews = result.reduce((acc, curr) => acc + curr.count, 0);
        const totalRating = result.reduce((acc, curr) => acc + curr._id * curr.count, 0);
        const overallRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

        res.status(200).json({
            overallRating,
            ratingCount: result,
            totalReviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating overall rating', error });
    }
};
