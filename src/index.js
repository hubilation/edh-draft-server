import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import passport from "passport";
import {ensureLoggedIn} from 'connect-ensure-login';

import { Strategy } from "passport-local";

passport.use(
  new Strategy(function(username, password, done) {
    return done(null, { id: 1, email: "test", name: "steve" });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, { id: 1, email: "test", name: "steve" });
});

var app = express();

// app.configure(function(){
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({ secret: "loldrafting", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
// });

app.get("/login", function(req, res) {
  res.sendFile(path.join(__dirname, "src", "login.html"));
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/butts",
    failureRedirect: "/fail"
  }),
  function(req, res) {
    console.log("got login");
  }
);

app.get(
  "/",
  ensureLoggedIn('/login'),
  function(req, res) {
    res.send("home page");
  }
);

app.get("/butts", ensureLoggedIn('/login'), function(req, res) {
  res.send(`hello ${req.user.name}, you logged in, sort of`);
});

app.get("/fail", function(req, res) {
  res.send("fuckin idiot");
});

app.listen(5000);
