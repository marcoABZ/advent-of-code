const fs = require('fs');

const filePath = '../input.txt';

console.time('Total')
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
let sum = 0;

lines.forEach(line => sum += getCardValue(line))
console.timeEnd('Total')
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

  if (ownWinningNumbers === 0) return 0
  return Math.pow(2, ownWinningNumbers - 1)
}
