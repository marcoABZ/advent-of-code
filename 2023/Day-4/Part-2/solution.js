const fs = require('fs');

const filePath = './input.txt';

const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
let sum = 0;
let counter = {}

for(let i = 0; i < lines.length; i++) {
  counter[i] = 1
}

lines.forEach((line, i) => {
  const correctValues = getCardValue(line)
  sum += counter[i]

  for(let j = 1; j <= correctValues; j++) {
    counter[i+j] += counter[i]
  }
})

console.log(sum)

function getCardValue(line) {
  const winningNumbers = line
    .trim()
    .split(":")[1]
    .split("|")[0]
    .trim()
    .split(" ")
    .filter(el => el !== "")
    .map(el => Number(el.trim()))
    .sort((a, b) => a - b)

  const ownNumbers = line
    .trim()
    .split(":")[1]
    .split("|")[1]
    .trim()
    .split(" ")
    .filter(el => el != "")
    .map(el => Number(el))
    .sort((a, b) => a - b)

  let ownWinningNumbers = 0
  let i = 0
  let j = 0
  while (i < winningNumbers.length && j < ownNumbers.length) {
    if (winningNumbers[i] == ownNumbers[j]) {
      ownWinningNumbers += 1;
      i += 1;
      j += 1;
      continue
    }
    
    if (ownNumbers[j] > winningNumbers[i]) {
      i += 1;
    } else {
      j += 1;
    }
  }

  return ownWinningNumbers
}