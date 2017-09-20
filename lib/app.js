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

var _passportLocal = require("passport-local");

var _mongoRepo = require("./mongoRepo");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_passport2.default.use(new _passportLocal.Strategy(function (username, password, done) {
  return done(null, { id: 1, email: "test", name: "steve" });
}));

_passport2.default.serializeUser(function (user, done) {
  done(null, user.id);
});

_passport2.default.deserializeUser(function (id, done) {
  done(null, { id: 1, email: "test", name: "steve" });
});

var app = (0, _express2.default)();

// app.configure(function(){
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use((0, _expressSession2.default)({ secret: "loldrafting", resave: false, saveUninitialized: false }));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
// });

app.get("/login", function (req, res) {
  res.sendFile(_path2.default.join(__dirname, "src", "login.html"));
});

app.post("/login", _passport2.default.authenticate("local", {
  successRedirect: "/butts",
  failureRedirect: "/fail"
}), function (req, res) {
  console.log("got login");
});

app.get("/", (0, _connectEnsureLogin.ensureLoggedIn)('/login'), function (req, res) {
  res.send("home page");
});

app.get("/butts", (0, _connectEnsureLogin.ensureLoggedIn)('/login'), function (req, res) {
  res.send("hello " + req.user.name + ", you logged in, sort of");
});

app.get("/fail", function (req, res) {
  res.send("fuckin idiot");
});

(0, _mongoRepo.testConnection)();

app.listen(5000);