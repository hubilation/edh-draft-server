import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import passport from "passport";
import {ensureLoggedIn} from 'connect-ensure-login';
import flash from "connect-flash";

import {configurePassport} from './authentication';

import { MongoClient } from "mongodb";
import logger from 'winston';
import db from './db';
import {listAll, createUser, getUser} from './userRepo';


configurePassport();
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({ secret: "loldrafting", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/login", function(req, res) {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/loggedin",
    failureRedirect: "/failedlogin",
    failureFlash: true
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

app.get("/loggedin", ensureLoggedIn('/login'), function(req, res) {
  res.json({
      loggedIn: true
  });
});

app.get("/failedlogin", function(req, res) {
    var flash = req.flash();
    res.json({
        loggedIn: false,
        message: flash.error[0]
    });
});

db.once('open', ()=>{
    app.listen(5000);
})

