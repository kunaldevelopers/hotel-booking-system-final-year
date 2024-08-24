const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        path: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    Category: {
        type: String,
        enum: [
            "Trending",
            "Room",
            "Iconic-City",
            "Mountains",
            "Castles",
            "Swimming-Pools",
            "Camping",
            "Farms",
            "Arctic",
            "Riding",
            "Sports",
            "Technology",
            "Travel",
            "Music",
            "Books",
            "Art"
          ],
        //   required: true // Makes this field mandatory
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;