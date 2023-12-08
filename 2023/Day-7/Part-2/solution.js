const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
const cardValues = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 1, 'T': 10, '9': 9, '8': 8,
  '7': 7,  '6': 6,  '5': 5,  '4': 4,  '3': 3,  '2': 2
}

let results = []

lines.forEach((line) => {
  const [hand, bid] = line.split(" ");

  const handRank = getHandRank(hand)
  results.push([hand, bid, handRank])
})

const totalPrizing = results
  .sort((a, b) => {
    if (a[2] !== b[2]) return b[2] - a[2]
  
    let i = 0;
    while (i <= 4) {
      if (a[0][i] !== b[0][i]) return cardValues[a[0][i]] - cardValues[b[0][i]]
      i += 1
    }

    return 0
  })
  .reduce((prev, curr, index) => {
    return (prev + Number(curr[1]) * (index + 1))
  }, 0)

console.log(totalPrizing)

function getHandRank(hand) {
  let cards = {
    'A': 0, 'K': 0, 'Q': 0, 'J': 0, 'T': 0, '9': 0, '8': 0,
    '7': 0, '6': 0, '5': 0, '4': 0, '3': 0, '2': 0, 
  }

  Array.from(hand).forEach(card => {
    if (card === 'J') {
      Object.keys(cards).forEach(key => cards[key] += 1)
    } else {
      cards[card] += 1
    }
  })

  let threeOfAKind = 0;
  let pairs = 0;
  let rank = -1;
  let jokers = cards['J'];

  Object.entries(cards).forEach((entry) => {
    const [card, count] = entry
    if (card != 'J' && count === jokers) return

    switch (count) {
      case 5:
        rank = 1;
        break;
      case 4:
        if (rank !== 1) rank = 2;
        break;
      case 3:
        threeOfAKind += 1;
        break;
      case 2:
        if(card !== 'J') pairs += 1;
        break;
    }
  })

  if (rank !== -1) return rank
  if ((threeOfAKind >= 1 && pairs >= 1 && cards['J'] % 2 === 0) || threeOfAKind === 2) {
    rank = 3
  } else if (threeOfAKind >= 1) {
    rank = 4
  } else if (pairs >= 2 && cards['J'] % 2 === 0) {
    rank = 5
  } else if (pairs >= 1) {
    rank = 6
  } else {
    rank = 7
  }

  return rank
}