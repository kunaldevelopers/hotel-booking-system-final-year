const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {reviewSchema} = require("./models/review.js");
const {listingSchema} = require("./models/listing.js");

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must Be Logged In");
        return res.redirect("/login");
      }
    next();
}



module.exports.savedRedirectUrl = (req, res, next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


// Auth for Edit and Update
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  
  // Find the listing by ID
  const listing = await Listing.findById(id);

  // Check if listing exists
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Check if the user is the owner of the listing
  if (!listing.owner.equals(res.locals.CurrentUser._id)) {
    req.flash("error", "You are not the Owner of this listing⚠️⚠️!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// Review Authorisation
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  
  // Find the Review by ID
  const review = await Review.findById(reviewId);

  // Check if the user is the owner of the listing
  if (!review.author.equals(res.locals.CurrentUser._id)) {
    req.flash("error", "You are not the Author of this Review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// Validate Error 
module.exports.validateError = (req, res, next)=>{
  const {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}

// Validate Reviews
module.exports.validateReview = (req, res, next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}