import { List, Map, fromJS } from "immutable";
import { db } from "../db";

export function buildState(draftId){
    var picks = getPicks(draftId);
    var draft = getDraft(draftId);

    return buildStateFromDraftAndPicks(draft,picks);
}

export function getPicks(draftId){
    var picks = fromJS(db.picks).filter(p=>p.get("draftId") == draftId);

    return picks;
}

export function getDraft(draftId) {
  var draft = fromJS(db.drafts).find(f => f.get("draftId") == draftId);

  return draft;
}

export function buildStateFromDraftAndPicks(draft, picks) {
  var sortedPicks = fromJS(picks).sort(
    (a, b) => b.get("pickId") - a.get("pickId")
  );
  var lastPick = sortedPicks.get(0);

  var direction = getDirection(draft, sortedPicks);

  var state = Map({
      activePick: getNextPick(draft, sortedPicks, direction),
      previousPicks: sortedPicks,
      direction: direction,
      pickOrder: draft.get("players")
  });

  console.log("previousPicks", state.get("previousPicks"));

  return state;
}

export function getDirection(draft, sortedPicks) {
  var pickOrder = draft.get("players");

  var ratio = sortedPicks.get(0).get("pickId") / pickOrder.size;

  var ratioFloor = Math.floor(ratio);

  if (ratioFloor % 2 == 0) {
    return "ascending";
  }

  return "descending";
}

export function getNextPick(draft, sortedPicks, direction) {
  var pickOrder = draft.get("players");
  var latestPick = sortedPicks.get(0);
  let lastPlayerIndex = pickOrder.findIndex(p => p === latestPick.get("playerId"));
  let nextPlayerIndex = -1;

  if (direction == "ascending") {
    nextPlayerIndex = lastPlayerIndex + 1;
  } else {
    nextPlayerIndex = lastPlayerIndex - 1;
  }

  return Map({
    playerId: pickOrder.get(nextPlayerIndex),
    pickId: latestPick.get("pickId") + 1
  });
}
