import ODMTester from "./ODMTester";
import mongoose from "mongoose";

var SERVER = `localhost`,
    db;

mongoose.connect(`mongodb://${SERVER}/test`);

db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
console.log("Database ready!");

module.exports.onCreateODM = function (callback) {

    db.once("open", function () {

        console.log("Handler caught!");
        callback(new ODMTester(db));

        //tester.addNewUser("User " + Math.random().toString().slice(2), "Without a surname");

    });

};