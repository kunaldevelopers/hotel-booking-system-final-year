const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../ExpressError");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const reviews = require("../models/review.js");
const {reviewSchema} = require("../Schema.js");
const review = require('../models/review.js');
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");


// Create Reviews
module.exports.CreateReviews = async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new reviews(req.body.review);
    console.log(newReview);
    newReview.author = req.user._id;
    console.log(newReview);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
  
    console.log("New Review Saved");
    req.flash ("success", "New Review Created!!");
    res.redirect(`/listings/${listing._id}`);
}

// Delete Reviews
module.exports.deleteReviews = async (req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash ("success", "Review Deleted!!");
    res.redirect(`/listings/${id}`);
    }
    