import schemas from "./schemas";
import mongoose from "mongoose";
import crypto from "crypto";

module.exports = class ODMTester {

    constructor (db) {
        this.db = db;
    }

    addNewUser (data, callback1) {

        var callback = function (a, b) { mongoose.disconnect(); callback1(a, b); };

        if (!data.password || data.password.length < 4) {
            callback("Unable to save: please, enter longer password."); return;
        }
        if (!data.name || data.name.length < 2) {
            callback("Unable to save: please, enter longer name."); return;
        }
        if (!data.surname || data.surname < 2) {
            callback("Unable to save: please, enter longer surname."); return;
        }
        if (!data.username || data.username < 2) {
            callback("Unable to save: please, enter longer username."); return;
        }
        if (!data.eMail || !/^[a-zA-Z\.\+]+@[a-zA-Z\.]+$/.test(data.eMail+"")) {
            callback("Unable to save: please, enter valid e-mail address."); return;
        }

        var User = schemas.User;

        User.findOne({ username: data.username }, function (err, user) {

            var newUser;

            if ((err || user) && !(data._id === (user || {})._id)) {
                callback(`A user with username "${data.username}" already exists!`);
                return;
            }

            if ((data._id === (user || {})._id)) newUser = User({
                name: data.name,
                surname: data.surname,
                username: data.username,
                password: crypto.createHash("sha1").update(data.password).digest("hex"),
                eMail: data.eMail
            }); else {
                newUser = user;
                if (data.name) user.name = data.name;
                if (data.surname) user.name = data.surname;
                if (data.username) user.name = data.username;
                if (data.password) user.password = crypto.createHash("sha1").update(data.password).digest("hex");
                if (data.eMail) user.eMail = data.eMail;
            }

            console.log(`I'm going to fill "${newUser.getFullName()}" in the database!`);

            newUser.save(function (err, user) {
                if (err) {
                    console.error("I'm not able to save a new user, sorry!");
                    callback("MongoDB error!");
                    return;
                }
                mongoose.connection.close();
                console.log(err ? err : `I'm done, and new user's ID is ${user._id}!`);
                callback(null, newUser);
            });

        });

    }

    listUsers (callback) {

        var User = schemas.User;

        User.find({}, function (err, users) {

            callback(err, users);

        });

    }

    removeUser (userId, callback) {

        schemas.User.remove({ _id: userId }, function (err) {
            callback(err);
        });

    }

};