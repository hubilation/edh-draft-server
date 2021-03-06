"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _connectEnsureLogin = require("connect-ensure-login");

var _connectFlash = require("connect-flash");

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _authentication = require("./authentication");

var _mongodb = require("mongodb");

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _db = require("./db");

var _db2 = _interopRequireDefault(_db);

var _userRepo = require("./userRepo");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _authentication.configurePassport)();
var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use((0, _expressSession2.default)({ secret: "loldrafting", resave: false, saveUninitialized: false }));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use((0, _connectFlash2.default)());

app.get("/login", function (req, res) {
  res.json({
    loggedIn: false
  });
});

app.post("/login", _passport2.default.authenticate("local", {
  successReturnToOrRedirect: "/",
  failureRedirect: "/failedlogin",
  failureFlash: true
}), function (req, res) {
  console.log("got login");
});

app.get("/", (0, _connectEnsureLogin.ensureLoggedIn)('/login'), function (req, res) {
  res.send("home page");
});

app.get("/loggedin", (0, _connectEnsureLogin.ensureLoggedIn)('/login'), function (req, res) {
  res.json({
    loggedIn: true
  });
});

app.get("/failedlogin", function (req, res) {
  var flash = req.flash();
  res.json({
    loggedIn: false,
    message: flash.error[0]
  });
});

_db2.default.once('open', function () {
  app.listen(5000);
});