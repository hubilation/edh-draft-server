import { List, Map } from "immutable";

export default class PickBuilder {
  buildPicks(activeDraft) {
    var picks = [];
    for (var round = 0; round < activeDraft.totalRounds; round++) {
      activeDraft.playerIds.forEach(function(playerId, playerIndex) {
        let pick = {
          id: round * playerIndex,
          playerId: playerId,
          draftId: activeDraft.id
        };
        picks.push(pick);
      }, this);
    }
    return picks;
  }
}

export function draft(state, cardId) {
  var newState = state.merge(
    Map({
      "activePick": buildNextPick(state),
      "previousPicks": addPreviousPick(state, cardId),
      "direction": setDirectionIfNecessary(state)
    })
  );

  return newState;
}

export function addPreviousPick(state, cardId){
  var previousPicks = state.get("previousPicks");
  var addedPick = previousPicks.splice(0, 0, setPick(state, cardId));

  return addedPick;
}

export function setPick(state, cardId) {
  const currentPick = state.get("activePick");

  const picked = currentPick.merge({
    cardId: cardId
  });

  return picked;
}

export function buildNextPick(state) {
  const currentPick = state.get("activePick");

  var lastPlayerId = currentPick.get("playerId");

  const pickOrder = state.get("pickOrder");

  var lastPlayerIndex = pickOrder.findIndex(p => p === lastPlayerId);

  const direction = state.get("direction");

  let nextIndex = 0;
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

  return Map({
    playerId: pickOrder.get(nextIndex),
    pickId: currentPick.get("pickId") + 1
  });
}

export function setDirectionIfNecessary(state) {
  const currentPick = state.get("activePick");

  var lastPlayerId = currentPick.get("playerId");

  const pickOrder = state.get("pickOrder");

  var lastPlayerIndex = pickOrder.findIndex(p => p === lastPlayerId);

  const direction = state.get("direction");

  let nextIndex = 0;
  if (direction === "ascending") {
    nextIndex = lastPlayerIndex + 1;
    if (nextIndex > pickOrder.size - 1) {
      return "descending";
    }
  } else {
    nextIndex = lastPlayerIndex - 1;
    if (nextIndex < 0) {
      return "ascending"
    }
  }

  return direction;
}
