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