var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
//plugin passport into mongoose UserSchema.
UserSchema.plugin(passportLocalMongoose);

//export User model
module.exports = mongoose.model("User", UserSchema);