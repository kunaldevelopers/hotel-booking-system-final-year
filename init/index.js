// const mongoose = require('mongoose');
// const initData = require("./data");
// const Listing = require("../models/listing.js");

// main()
//     .then((res)=>{console.log("Connection Established !!")})
//     .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

// const initDB = async ()=>{
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({...obj, owner: "66bcccb4636671b8e34885c9"}));
//     await Listing.insertMany(initData.data);
//     console.log("Data Was Initialized");
// }

// initDB();

// new init
const mongoose = require('mongoose');
const initData = require("./data");
const Listing = require("../models/listing.js");

// Define the categories array
const categories = [
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
];

// Define the bounds for random coordinates within India
const bounds = {
  latMin: 6.4626,   // Southernmost latitude in India
  latMax: 37.0841,  // Northernmost latitude in India
  lonMin: 68.1766,  // Westernmost longitude in India
  lonMax: 97.4026   // Easternmost longitude in India
};

main()
  .then(() => { console.log("Connection Established !!") })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// Function to get a random category
const getRandomCategory = () => {
  return categories[Math.floor(Math.random() * categories.length)];
}

// Function to generate random coordinates within India
const getRandomCoordinates = () => {
  const lat = Math.random() * (bounds.latMax - bounds.latMin) + bounds.latMin;
  const lon = Math.random() * (bounds.lonMax - bounds.lonMin) + bounds.lonMin;
  return [lon, lat]; // Note: [longitude, latitude]
}

const initDB = async () => {
  await Listing.deleteMany({});

  // Map through initData.data and assign a random category and coordinates to each item
  initData.data = initData.data.map((obj) => {
    return {
      ...obj,
      owner: "66bcccb4636671b8e34885c9",
      Category: getRandomCategory(),
      geometry: {
        type: "Point",         // Required type
        coordinates: getRandomCoordinates() // Randomized coordinates
      }
    };
  });

  await Listing.insertMany(initData.data);
  console.log("Data Was Initialized");
}

initDB();
