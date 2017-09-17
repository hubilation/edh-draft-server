import { List, Map } from "immutable";
import { expect } from "chai";
import {cardIsAvailable, playerIsActivePlayer} from "../src/validation";

describe("validation", ()=>{
    var picks = List.of(
        Map({
            "pickId":4,
            "playerId":4,
            "cardId": "uniqueCardId"
        })
    );

    it("should return false when card has been picked", ()=>{
        expect(cardIsAvailable("uniqueCardId", picks)).to.be.false;
    });

    it("should return true when card has not been picked", ()=>{
        expect(cardIsAvailable("unpickedId", picks)).to.be.true;
    });

    it("should return false when activePick.playerId does not match passed in playerId", ()=>{
        var activePick = Map({
            "pickId":4,
            "playerId":4,
            "cardId": "uniqueCardId"
        });
        
        expect(playerIsActivePlayer(3,activePick)).to.be.false;
    });

    it("should return true when activePick.playerId matches passed in playerId", ()=>{
        var activePick = Map({
            "pickId":4,
            "playerId":4,
            "cardId": "uniqueCardId"
        });
        
        expect(playerIsActivePlayer(4,activePick)).to.be.true;
    });
});