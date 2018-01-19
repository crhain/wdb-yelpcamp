var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleWare = require("../middleware");
var isLoggedIn = middleWare.isLoggedIn;
var checkCampgroundOwnership = middleWare.checkCampgroundOwnership;

//INDEX ROUTE
router.get("/", (req, res) =>{
     //Get all campgrounds from DB
    Campground.find({}, (err, campgrounds) =>{
        if(err){
            console.log("ERROR!");
        } else {
            res.render("campgrounds/index", {campgrounds});
        }
    });
    
});

//NEW ROUTE
router.get("/new", isLoggedIn, (req, res) =>{
    //find the campground with provided ID
    //render show template with that campground
    res.render("campgrounds/new"); 
});

//CREATE ROUTE
router.post("/", isLoggedIn, (req, res) =>{
    //get data from form and add to campgrounds array
    var campground = req.body.campground;
    campground.price = Number.parseFloat(campground.price).toFixed(2).toString();
    campground.author = {};
    campground.author.id = req.user._id;
    campground.author.username = req.user.username;
    
    // var name = req.body.name;
    // var image = req.body.image;
    // var description = req.body.description || "none";
    // var author = {
    //   id: req.user._id,
    //   username: req.user.username
    // };
    // var newCampground = {name, image, description, author};
    Campground.create(campground, (err, campground) => {
        if(err){
            console.log("Could not create!");
        } else {
            console.log(campground);
            //redirect to /campgrounds route
            res.redirect("/campgrounds");        
        }
    });
    
});

//SHOW ROUTE - shows more info about campground
router.get("/:id", (req, res) =>{
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground){
        if(err || !campground){
            console.log(err);
            req.flash("error", "Sorry, that campground does not exist!");
            return res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground});        
        }
    });
    
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
    // is user logged in?
        Campground.findById(req.params.id, function(err, campground){
            if(err || !campground){
                req.flash("error", "Sorry, that campground was not found!");
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground});            
            }
        });            
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, (req, res) =>{
    var campground = req.body.campground;
    campground.price = Number.parseFloat(campground.price).toFixed(2).toString();
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, campground, function(err, campground){
       if(err){
           res.redirect("/campgrounds");
       } else {
            //redirect somehwere (show page)
            res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, (req, res) =>{
    //find and update the correct campground
    Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect("/campgrounds");
      } else {
        //redirect somehwere (show page)
        res.redirect("/campgrounds");
      }
    });
});


module.exports = router;