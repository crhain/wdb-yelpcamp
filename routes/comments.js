// ============================================
// COMMENTS ROUTES
// ============================================
var express = require("express");
var router = express.Router({mergeParams: true});  //need to set this option to merge campground params into comment params
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleWare = require("../middleware");
var isLoggedIn = middleWare.isLoggedIn;
var checkCommentOwnership = middleWare.checkCommentOwnership;


//Comments New
router.get("/new", isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
       if(err || !campground){
        console.log(err);
        res.redirect("back");
       } else {
        //render new comment form
        res.render("comments/new", {campground});                   
       }
    });
    
});

//Comments Create
router.post("/", isLoggedIn, (req, res) =>{
   //find campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err || !campground) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        //create new comment
        Comment.create(req.body.comment, function(err, comment){
            if(err || !comment){
                console.log(err);
                res.redirect("/");
            } else {
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                //push comment to campground
                campground.comments.push(comment._id);
                campground.save();
                console.log(comment);
                req.flash("success", "Successfully added comment.");
                //redirect to show page for campground
                res.redirect("/campgrounds/" + campground._id);
            }
        });
       
       }
   });
});
//COMMENTS EDIT ROUTE 
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err || !comment){
            console.log(err);
            req.flash("error", "Sorry, that comment does not exist!");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment});    
        }
                    
    });
});

//COMMENTS UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, (req, res) =>{
    //update comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , function(err, comment){
      if(err || !comment){
            console.log(err);
            res.redirect("back");
      } else {
           res.redirect("/campgrounds/" + req.params.id);
      }
    });
});

//COMMENTS DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, (req, res) =>{
   //res.send("YOU HAVE REACHED THE COMMENT DESTROY ROUTE"); 
   //findByIdAndRemove
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);                        
        }
   });
});


module.exports = router;
