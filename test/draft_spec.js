import { List, Map } from "immutable";
import { expect } from "chai";
import {
  draft,
  setPick,
  buildNextPick,
  setDirectionIfNecessary
} from "../src/draft";

describe("draft", () => {
  var draftState = Map({
    activePick: Map({
      playerId: 2,
      pickId: 2
    }),

    previousPicks: List.of(
      Map({
        playerId: 1,
        pickId: 1,
        cardId: "uniqueCardId"
      })
    ),

    direction: "ascending",

    pickOrder: List.of(1, 2, 3, 4, 5, 6, 7, 8)
  });

  it("should do everything", () => {
    var nextState = draft(draftState, "uniqueCardId2");

    expect(nextState).to.equal(
      Map({
        activePick: Map({
          playerId: 3,
          pickId: 3
        }),

        previousPicks: List.of(
          Map({
            playerId: 2,
            pickId: 2,
            cardId: "uniqueCardId2"
          }),
          Map({
            playerId: 1,
            pickId: 1,
            cardId: "uniqueCardId"
          })
        ),

        direction: "ascending",

        pickOrder: List.of(1, 2, 3, 4, 5, 6, 7, 8)
      })
    );
  });

  it("should update the activePick", () => {
    var activePick = draftState.get("activePick");

    var updatedPick = setPick(draftState, "uniqueCardId2");

    expect(updatedPick).to.equal(
      Map({
        playerId: 2,
        pickId: 2,
        cardId: "uniqueCardId2"
      })
    );
  });

  it("should save the pick to previouspicks", () => {
    const nextState = draft(draftState, "uniqueCardId2");

    const previousPicks = nextState.get("previousPicks");

    expect(previousPicks).to.equal(
      List.of(
        Map({
          playerId: 2,
          pickId: 2,
          cardId: "uniqueCardId2"
        }),
        Map({
          playerId: 1,
          pickId: 1,
          cardId: "uniqueCardId"
        })
      )
    );
  });

  it("should create the new pick with the correct player", () => {
    var nextPick = buildNextPick(draftState);

    expect(nextPick).to.equal(
      Map({
        playerId: 3,
        pickId: 3
      })
    );
  });

  it("should allow the player to pick a second time if at end of order and ascending", () => {
    var state = Map({
      activePick: Map({
        playerId: 8,
        pickId: 8
      }),
      pickOrder: List.of(1, 2, 3, 4, 5, 6, 7, 8),
      direction: "ascending"
    });

    var nextPick = buildNextPick(state);

    expect(nextPick).to.equal(
      Map({
        playerId: 8,
        pickId: 9
      })
    );
  });

  it("should allow the player to pick a second time if at start of order and descending", () => {
    var state = Map({
      activePick: Map({
        playerId: 1,
        pickId: 16
      }),
      pickOrder: List.of(1, 2, 3, 4, 5, 6, 7, 8),
      direction: "descending"
    });

    var nextPick = buildNextPick(state);

    expect(nextPick).to.equal(
      Map({
        playerId: 1,
        pickId: 17
      })
    );
  });

  it("should swap direction at low end of snake", () => {
    var state = Map({
      activePick: Map({
        playerId: 1,
        pickId: 16
      }),
      pickOrder: List.of(1, 2, 3, 4, 5, 6, 7, 8),
      direction: "descending"
    });

    var newDirection = setDirectionIfNecessary(state);

    expect(newDirection).to.equal("ascending");
  });

  it("should swap direction at high end of snake", () => {
    var state = Map({
      activePick: Map({
        playerId: 8,
        pickId: 16
      }),
      pickOrder: List.of(1, 2, 3, 4, 5, 6, 7, 8),
      direction: "ascending"
    });

    var newDirection = setDirectionIfNecessary(state);

    expect(newDirection).to.equal("descending");
  });

  it("should not swap direction when not at end of snake and ascending", () => {
    var state = Map({
      activePick: Map({
        playerId: 7,
        pickId: 16
      }),
      pickOrder: List.of(1, 2, 3, 4, 5, 6, 7, 8),
      direction: "ascending"
    });

    var newDirection = setDirectionIfNecessary(state);

    expect(newDirection).to.equal("ascending");
  });

  it("should not swap direction when not at end of snake and descending", () => {
    var state = Map({
      activePick: Map({
        playerId: 7,
        pickId: 16
      }),
      pickOrder: List.of(1, 2, 3, 4, 5, 6, 7, 8),
      direction: "descending"
    });

    var newDirection = setDirectionIfNecessary(state);

    expect(newDirection).to.equal("descending");
  });
});
