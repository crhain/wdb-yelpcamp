var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR0-5PA-Rpw6C5HZCZ4YKjLNsFuHm0NiSVzBadcCkz1OxNA9Zl",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc leo justo, rutrum ut luctus et, vulputate a mauris. Praesent nec risus et justo maximus elementum. Aliquam libero libero, lacinia quis lorem lobortis, fringilla lacinia nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus ac orci felis. Curabitur ultricies vehicula consectetur. Proin vel ornare velit, eu lacinia justo. Nam ligula metus, tempor eu lacus at, molestie euismod lacus."
    },
    {
        name: "Desert Mesa",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/01/ec/8d/2a/capitol-reef-national.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc leo justo, rutrum ut luctus et, vulputate a mauris. Praesent nec risus et justo maximus elementum. Aliquam libero libero, lacinia quis lorem lobortis, fringilla lacinia nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus ac orci felis. Curabitur ultricies vehicula consectetur. Proin vel ornare velit, eu lacinia justo. Nam ligula metus, tempor eu lacus at, molestie euismod lacus."
    },
    {
        name: "Canyon Floor",
        image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5328651.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc leo justo, rutrum ut luctus et, vulputate a mauris. Praesent nec risus et justo maximus elementum. Aliquam libero libero, lacinia quis lorem lobortis, fringilla lacinia nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus ac orci felis. Curabitur ultricies vehicula consectetur. Proin vel ornare velit, eu lacinia justo. Nam ligula metus, tempor eu lacus at, molestie euismod lacus."
    },
    ];

function seedDB(){
    //Clear database
    Campground.remove({}, function(err){
        if(err){
            console.log("ERROR!");
        } else {
            console.log("removed campground!");
            //add a few campgrounds
            data.forEach((seed) =>{
                Campground.create(seed, (err, campground) =>{
                    if(err){
                        console.log("ERROR!");
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create({
                            text: "This place is great, but wish there as internet",
                            author: "Homer"
                            
                        }, function(err, comment){
                            if(err){
                                console.log("ERROR!");
                            } else {
                                campground.comments.push(comment._id);
                                campground.save();    
                                console.log("created new comment!");
                            }
                            
                        });
                    }
                });    
            });
        }   
    });
}

module.exports = seedDB;
