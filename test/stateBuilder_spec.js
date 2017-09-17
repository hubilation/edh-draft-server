import { List, Map, fromJS } from "immutable";
import { expect } from "chai";
import {
  getDraft,
  getPicks,
  buildStateFromDraftAndPicks,
  getDirection,
  getNextPick,
  buildState
} from "../src/stateBuilder";

describe("stateBuilder", () => {
  it("should get the draft", () => {
    var draft = getDraft(1);
  });

  it("should get picks", ()=>{
    var picks = getPicks(1);
    console.log(picks);
  });

  it("should build the state", ()=>{
    var state = buildState(1);

    expect(state).to.equal(Map({
        activePick: Map({
            "playerId": 5,
            "pickId": 5
        }),
        previousPicks: List.of(
            Map({
              playerId: 4,
              pickId: 4,
              cardId: "uniqueCardId4",
              draftId: 1
            }),
            Map({
              playerId: 3,
              pickId: 3,
              cardId: "uniqueCardId3",
              draftId: 1
            }),
            Map({
              playerId: 2,
              pickId: 2,
              cardId: "uniqueCardId2",
              draftId: 1
            }),
            Map({
              playerId: 1,
              pickId: 1,
              cardId: "uniqueCardId",
              draftId: 1
            })
        ),
        direction: "ascending",
        pickOrder: List.of(1,2,3,4,5,6,7,8)
    }));
  });

  it("should set direction to ascending when less picks than players", () => {
    var picks = [
      {
        playerId: 4,
        pickId: 4,
        cardId: "uniqueCardId4",
        draftId: 1
      },
      {
        playerId: 3,
        pickId: 3,
        cardId: "uniqueCardId3",
        draftId: 1
      },
      {
        playerId: 2,
        pickId: 2,
        cardId: "uniqueCardId2",
        draftId: 1
      },
      {
        playerId: 1,
        pickId: 1,
        cardId: "uniqueCardId",
        draftId: 1
      }
    ];

    var draft = Map({
      players: List.of(1, 2, 3, 4, 5, 6, 7, 8)
    });

    var direction = getDirection(draft, fromJS(picks));

    expect(direction).to.equal("ascending");
  });

  
  it("should set direction to descending when highest pick is equal to total players", () => {
    var picks = [
      {
        playerId: 4,
        pickId: 8,
        cardId: "uniqueCardId4",
        draftId: 1
      }
    ];

    var draft = Map({
      players: List.of(1, 2, 3, 4, 5, 6, 7, 8)
    });

    var direction = getDirection(draft, fromJS(picks));

    expect(direction).to.equal("descending");
  });

  it("should set direction to descending when highest pick is equal to total players x 3", () => {
    var picks = [
      {
        playerId: 4,
        pickId: 24,
        cardId: "uniqueCardId4",
        draftId: 1
      }
    ];

    var draft = Map({
      players: List.of(1, 2, 3, 4, 5, 6, 7, 8)
    });

    var direction = getDirection(draft, fromJS(picks));

    expect(direction).to.equal("descending");
  });

  it("should set direction to ascending when highest pick is equal to total players x 2", () => {
    var picks = [
      {
        playerId: 4,
        pickId: 16,
        cardId: "uniqueCardId4",
        draftId: 1
      }
    ];

    var draft = Map({
      players: List.of(1, 2, 3, 4, 5, 6, 7, 8)
    });

    var direction = getDirection(draft, fromJS(picks));

    expect(direction).to.equal("ascending");
  });

  it("should set direction to ascending when highest pick is equal to (total players x 2) + 3", () => {
    var picks = [
      {
        playerId: 4,
        pickId: 19,
        cardId: "uniqueCardId4",
        draftId: 1
      }
    ];

    var draft = Map({
      players: List.of(1, 2, 3, 4, 5, 6, 7, 8)
    });

    var direction = getDirection(draft, fromJS(picks));

    expect(direction).to.equal("ascending");
  });

  it("should build the next pick based on the direction", ()=>{
    var picks = [
        {
          playerId: 4,
          pickId: 19,
          cardId: "uniqueCardId4",
          draftId: 1
        }
      ];
  
      var draft = Map({
        players: List.of(1, 2, 3, 4, 5, 6, 7, 8)
      });
  
      var direction = getDirection(draft, fromJS(picks));

      var nextPick = getNextPick(draft, fromJS(picks), direction);

      expect(nextPick).to.equal(Map({
          playerId: 5,
          pickId: 20
      }));
  });

  it("should build the draft state", () => {});
});
