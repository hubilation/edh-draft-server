export const db = {
  drafts: [
    {
      draftId: 1,
      players: [1, 2, 3, 4, 5, 6, 7, 8],
      totalRounds: 100,
      startDate: "2018-01-10"
    }
  ],

  picks: [
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
  ]
};
