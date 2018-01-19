var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

//middleware to authenticate user
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //flash message if authentication fails and then redirect to /login
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

//middleware that checks to see if user logged in and own the campground
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, campground){
            if(err || !campground){
                req.flash("error", "Campgrounds not found!");
                res.redirect("back");
            } else if(campground.author.id.equals(req.user._id) || req.user.isAdmin) {
                req.campground = campground;
                next();
                // does user own the campground? - need to use .equals mongoose method
                // because req.user._id is an object and author.id is a string
                
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });            
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

//middleware to authenticate user
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, comment){
            if(err || !comment){
                console.log(err);
                req.flash("error", "Sorry, that comment does not exist!");
                res.redirect("/campgrounds");
            } else if(comment.author.id.equals(req.user._id) || req.user.isAdmin) {
                // does user own the comment? - need to use .equals mongoose method
                // because req.user._id is an object and author.id is a string
                req.comment = comment;
                next();            
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });            
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};


module.exports = middlewareObj;