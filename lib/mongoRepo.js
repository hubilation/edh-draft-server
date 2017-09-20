"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testConnection = testConnection;

var _mongodb = require("mongodb");

function testConnection() {
    _mongodb.MongoClient.connect("mongodb://165.227.24.220:27017/local", function (err, db) {
        if (!err) {
            console.log("We connected!");
        }
    });
}