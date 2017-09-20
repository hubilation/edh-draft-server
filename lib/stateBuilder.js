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