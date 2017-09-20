import { List, Map } from "immutable";
import {butt} from './test';

export function draft(state, cardId) {
  let newState = state.merge(
    Map({
      "activePick": buildNextPick(state),
      "previousPicks": addPreviousPick(state, cardId),
      "direction": setDirectionIfNecessary(state)
    })
  );

  return newState;
}

export function addPreviousPick(state, cardId){
  let previousPicks = state.get("previousPicks");
  let addedPick = previousPicks.splice(0, 0, setPick(state, cardId));

  return addedPick;
}

export function setPick(state, cardId) {
  let currentPick = state.get("activePick");

  let picked = currentPick.merge({
    cardId: cardId
  });

  return picked;
}

export function buildNextPick(state) {
  let currentPick = state.get("activePick");
  let lastPlayerId = currentPick.get("playerId");
  let pickOrder = state.get("pickOrder");
  let lastPlayerIndex = pickOrder.findIndex(p => p === lastPlayerId);

  let direction = state.get("direction");

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
  let currentPick = state.get("activePick");
  let lastPlayerId = currentPick.get("playerId");
  let pickOrder = state.get("pickOrder");
  let lastPlayerIndex = pickOrder.findIndex(p => p === lastPlayerId);
  let direction = state.get("direction");

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
