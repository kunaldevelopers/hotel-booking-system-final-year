const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../ExpressError");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Listing Data
module.exports.index = async (req, res)=>{
    let data = await Listing.find();
    res.render("listings/index.ejs", {data});
  }

// Create Listings
module.exports.createListings = async (req, res, next)=>{
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send()
    console.log(response.body.features[0].geometry);
    

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);

  // Category
  let Categories = req.body.listing;
  console.log(Categories);

  const newListing = new Listing(req.body.listing);   
  newListing.owner = req.user._id;  
  newListing.image = {url, filename}; 
  newListing.geometry = response.body.features[0].geometry;                              
  let savedListings = await newListing.save();
    console.log(savedListings);
  req.flash ("success", "New Listing Added!!");
  res.redirect("/listings");
}

// Add New Listings
module.exports.renderNewForm = (req, res)=>{
    res.render("listings/ListingForm.ejs");
  }

// Show Route
module.exports.ShowRoute = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!data){
      req.flash ("error", "Listing Dosen't Exist!!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { data });
}

// Edit Form
module.exports.editForm = async ( req, res, next)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!data){
      return next(new ExpressError('Invalid ID', 400));
    }
    let originalImageUrl = data.image.url;
    let newOriginalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/editPost.ejs", {data, newOriginalImageUrl});
}

// Update Listings
module.exports.updateListings = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    listing.image = {url, filename};
    await listing.save();
    }
        if(!listing){
          req.flash ("error", "Listing Dosen't Exist!!");
          res.redirect("/listings");
        }
        req.flash ("success", "Listing Updated!!");
        res.redirect("/listings");
    }
    // let {title: newT,description: newDesc,image: newImage,price: newPrice,location: newLocation, country: NewCountry} = req.body;
    // let data = {title: newT,description: newDesc,image: newImage,price: newPrice,location: newLocation, country: NewCountry}
    // try {
    //   let listings = await Listing.findByIdAndUpdate(id, data, {new: true});
    //     console.log(data);
    //     req.flash ("success", "Listing Updated!!");
    //     if(!listings){
    //       req.flash ("error", "Listing Dosen't Exist!!");
    //       res.redirect("/listings");
    //     }
    //     res.redirect("/listings");
    // } catch (error) {
    //     console.log(error);
    //     res.send("error while updating");
    // }
  // }

// Delete Listings
module.exports.deleteListings = async (req, res)=>{
    let {id} = req.params;
    let del = await Listing.findByIdAndDelete(id, {new:true});
    console.log(`This Post Deleted ${del}`);
    req.flash ("success", "Listing Deleted!!");
    res.redirect("/listings");
  }