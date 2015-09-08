import mongoose from "mongoose";

var UserSchema = mongoose.Schema({
    name: String,
    surname: String,
    eMail: String,
    username: String,
    password: String,
    registered: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.getFullName = function () {
    return `${this.name} ${this.surname}`;
};

UserSchema.methods.getApproximateAge = function () {
    return Math.round(
        (Date.now() - this.registered.getTime() + this.age*1000*60*60*24*365.25)
        /1000/60/60/24/365.25
    );
};

module.exports.User = mongoose.model("User", UserSchema);
