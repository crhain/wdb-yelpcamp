var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleWare = require("../middleware");
var isLoggedIn = middleWare.isLoggedIn;

//Root Route
router.get("/", (req, res) => {
   res.render("landing"); 
});

//SHOW REGISTER FORM
router.get("/register", (req, res) =>{
    res.render("register");
});

//REGISTER POST ROUTE
router.post("/register",(req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err) {
        console.log(err);  
        req.flash("error", err.message);
        //res.render("register");  
        res.redirect("/register");
       } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);   
                res.redirect("/campgrounds");           
            });    
       }
       
    });
    //res.send("signing you  up!");
});

//SHOW LOGIN FORM
router.get("/login", (req, res) =>{
    res.render("login");    
});

//Login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
   //nothing here for now
});

//LOGOUT
router.get("/logout", (req, res) =>{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;