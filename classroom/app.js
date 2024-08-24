const express = require("express");
const app = express();
const post = require("./routes/post.js");
const user = require("./routes/user.js");
const session  = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(flash());

const SessionOptions = {
    secret: "mysecret", 
    resave: false, 
    saveUninitialized: true
}

app.use(session(SessionOptions));

app.use((req, res, next) => {
    res.locals.SuccMsg = req.flash("Success");
    res.locals.ErrMsg = req.flash("Error");
    next();
});

app.get("/register", (req, res) => {
    let {name = "Anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    if(name === "Anonymous"){
        req.flash("Error", "User Not Registered!!😭😭");
    }else{
        req.flash("Success", "User Registerd Successfully!!🫡🫡");
    }
    res.redirect("/hello"); 
});

app.get("/hello", (req, res)=>{
    res.render("welcome.ejs", {name: req.session.name });
});

app.get("/test", (req, res)=>{
    res.send("Test Successfull!!");
});

app.get("/reqcount", (req, res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`You visited ${req.session.count} Times`);
});


app.listen(3000, ()=>{
    console.log("Classroom Started!!");
});