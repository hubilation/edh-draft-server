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

var _mongoRepo = require("./src/mongoRepo");

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
// import passport from 'passport';
// import {LocalStrategy} from 'passport-local';

// passport.use(new LocalStrategy(
//     function(username, password, done){
//         return done(null, {email:"test", name:"steve"});
//     }
// ))
"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draft = draft;
exports.addPreviousPick = addPreviousPick;
exports.setPick = setPick;
exports.buildNextPick = buildNextPick;
exports.setDirectionIfNecessary = setDirectionIfNecessary;

var _immutable = require("immutable");

var _test = require("./test");

function draft(state, cardId) {
  var newState = state.merge((0, _immutable.Map)({
    "activePick": buildNextPick(state),
    "previousPicks": addPreviousPick(state, cardId),
    "direction": setDirectionIfNecessary(state)
  }));

  return newState;
}

function addPreviousPick(state, cardId) {
  var previousPicks = state.get("previousPicks");
  var addedPick = previousPicks.splice(0, 0, setPick(state, cardId));

  return addedPick;
}

function setPick(state, cardId) {
  var currentPick = state.get("activePick");

  var picked = currentPick.merge({
    cardId: cardId
  });

  return picked;
}

function buildNextPick(state) {
  var currentPick = state.get("activePick");
  var lastPlayerId = currentPick.get("playerId");
  var pickOrder = state.get("pickOrder");
  var lastPlayerIndex = pickOrder.findIndex(function (p) {
    return p === lastPlayerId;
  });

  var direction = state.get("direction");

  var nextIndex = 0;
  if (direction === "ascending") {
    nextIndex = lastPlayerIndex + 1;
    if (nextIndex >= pickOrder.size - 1) {
      nextIndex = lastPlayerIndex;
    }
  } else {
    nextIndex = lastPlayerIndex - 1;
    if (nextIndex < 0) {
      nextIndex = lastPlayerIndex;
    }
  }

  return (0, _immutable.Map)({
    playerId: pickOrder.get(nextIndex),
    pickId: currentPick.get("pickId") + 1
  });
}

function setDirectionIfNecessary(state) {
  var currentPick = state.get("activePick");
  var lastPlayerId = currentPick.get("playerId");
  var pickOrder = state.get("pickOrder");
  var lastPlayerIndex = pickOrder.findIndex(function (p) {
    return p === lastPlayerId;
  });
  var direction = state.get("direction");

  var nextIndex = 0;
  if (direction === "ascending") {
    nextIndex = lastPlayerIndex + 1;
    if (nextIndex > pickOrder.size - 1) {
      return "descending";
    }
  } else {
    nextIndex = lastPlayerIndex - 1;
    if (nextIndex < 0) {
      return "ascending";
    }
  }

  return direction;
}
'use strict';

require('babel-polyfill');

require('./app');
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildState = buildState;
exports.getPicks = getPicks;
exports.getDraft = getDraft;
exports.buildStateFromDraftAndPicks = buildStateFromDraftAndPicks;
exports.getDirection = getDirection;
exports.getNextPick = getNextPick;

var _immutable = require("immutable");

var _db = require("../db");

function buildState(draftId) {
  var picks = getPicks(draftId);
  var draft = getDraft(draftId);

  return buildStateFromDraftAndPicks(draft, picks);
}

function getPicks(draftId) {
  var picks = (0, _immutable.fromJS)(_db.db.picks).filter(function (p) {
    return p.get("draftId") == draftId;
  });

  return picks;
}

function getDraft(draftId) {
  var draft = (0, _immutable.fromJS)(_db.db.drafts).find(function (f) {
    return f.get("draftId") == draftId;
  });

  return draft;
}

function buildStateFromDraftAndPicks(draft, picks) {
  var sortedPicks = (0, _immutable.fromJS)(picks).sort(function (a, b) {
    return b.get("pickId") - a.get("pickId");
  });
  var lastPick = sortedPicks.get(0);

  var direction = getDirection(draft, sortedPicks);

  var state = (0, _immutable.Map)({
    activePick: getNextPick(draft, sortedPicks, direction),
    previousPicks: sortedPicks,
    direction: direction,
    pickOrder: draft.get("players")
  });

  return state;
}

function getDirection(draft, sortedPicks) {
  var pickOrder = draft.get("players");

  var ratio = sortedPicks.get(0).get("pickId") / pickOrder.size;

  var ratioFloor = Math.floor(ratio);

  if (ratioFloor % 2 == 0) {
    return "ascending";
  }

  return "descending";
}

function getNextPick(draft, sortedPicks, direction) {
  var pickOrder = draft.get("players");
  var latestPick = sortedPicks.get(0);
  var lastPlayerIndex = pickOrder.findIndex(function (p) {
    return p === latestPick.get("playerId");
  });
  var nextPlayerIndex = -1;

  if (direction == "ascending") {
    nextPlayerIndex = lastPlayerIndex + 1;
  } else {
    nextPlayerIndex = lastPlayerIndex - 1;
  }

  return (0, _immutable.Map)({
    playerId: pickOrder.get(nextPlayerIndex),
    pickId: latestPick.get("pickId") + 1
  });
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.butt = butt;
function butt() {}
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cardIsAvailable = cardIsAvailable;
exports.playerIsActivePlayer = playerIsActivePlayer;

var _immutable = require("immutable");

function cardIsAvailable(cardId, picks) {
    var existingCard = picks.find(function (c) {
        return c.get("cardId") == cardId;
    });

    return existingCard == null;
}

function playerIsActivePlayer(playerId, activePick) {
    return activePick.get("playerId") === playerId;
}
