import { List, Map } from "immutable";

export function cardIsAvailable(cardId, picks){
    var existingCard = picks.find(c=>c.get("cardId") == cardId);

    return existingCard == null;
}

export function playerIsActivePlayer(playerId, activePick){
    return activePick.get("playerId") === playerId;
}