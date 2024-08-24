const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../ExpressError");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const reviews = require("../models/review.js");
const {reviewSchema} = require("../Schema.js");
const review = require('../models/review.js');
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")



const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
  }

// Create Reviews
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.CreateReviews));
  
  
// Delete Review Button
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReviews));

module.exports = router;