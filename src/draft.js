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
  };
}
