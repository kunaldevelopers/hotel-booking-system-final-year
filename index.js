if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const mongoose = require('mongoose');
const express = require("express");
const app = express();
const port = 8080;
const Listing = require("./models/listing");
const reviews = require("./models/review.js");
const path = require("path");
const methodOverRide = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./ExpressError");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema } = require("./Schema.js");
const {reviewSchema} = require("./Schema.js");
const review = require('./models/review.js');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/User.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");


const dburl = process.env.ATLAS_URL;


// DB Connection
main()
    .then((res)=>{console.log("Connection Established !!")})
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}


const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", ()=>{
  console.log("Error in MongoDB Session Store", err);
})

const SessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  }
}

app.use(session(SessionOptions));

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverRide("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));


// Root Directory
app.get("/", (req, res)=>{
  res.redirect("/listings");
});

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.CurrentUser = req.user;
  next();
});

// Categories Listing
app.get("/listings/category", async (req, res) => {
  const category = req.query.category;
  console.log(category);
  
  // Fetch listings based on category
  const listings = await Listing.find({ Category: category });
  
  // Render category.ejs and pass the data
  res.render("listings/category.ejs", { data: listings, category });
});

// Search Feature
app.get('/listings/find', async (req, res) => {
  const searchTerm = req.query.name;

  try {
    // Example: Finding listings where the title matches the search term
    const listings = await Listing.find({ title: { $regex: searchTerm, $options: 'i' } });
    
    res.render('listings', { data: listings, category: 'Search Results' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});



// Using listing here
app.use("/listings", listingRouter);



// Using Reviews here
app.use("/listings/:id/reviews", reviewRouter);

// Using UserRouter here
app.use("/", userRouter);




app.all("*",(req,res,next)=>{
  next(new ExpressError(404, "Page Not Found"));
});

const castError = (err)=>{
  console.log(`This Error was: ${err.message}`);
  return(err);
}

app.use((err,req,res,next)=>{
  if(err.name === "CastError"){
    castError(err);
  }
  console.log(err.name);
  next(err);
});

app.use((err,req,res, next)=>{
  let {status = 500, message = "Something Went Wrong"} = err;
  res.status(status).render("listings/error.ejs", {err});
  // res.status(status).send(message);
});

app.listen(port, ()=>{
    console.log("Machine started on port 8080 ====>>>>");
});