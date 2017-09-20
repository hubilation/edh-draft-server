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