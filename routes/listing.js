const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../Schema.js");
const ExpressError = require("../ExpressError");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const validateError = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Add new Listings
router.get("/new", isLoggedIn, wrapAsync(ListingController.renderNewForm));

router.route("/")
    // Listing data 
    .get(wrapAsync(ListingController.index))
    // Create Listings
    .post(isLoggedIn, upload.single('listing[image]'), wrapAsync(ListingController.createListings));
    

router.route("/:id")
    // Show Route
    .get(wrapAsync(ListingController.ShowRoute))
    // Update Route
    .put(isLoggedIn,isOwner,upload.single('listing[image]'), wrapAsync(ListingController.updateListings))

// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(ListingController.editForm));

// Delete Routes
router.delete("/:id/delete", isLoggedIn,isOwner, wrapAsync(ListingController.deleteListings));


module.exports = router;