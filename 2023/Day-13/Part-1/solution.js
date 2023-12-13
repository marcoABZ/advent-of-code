const fs = require('fs');

const filePath = '../input.txt';
const patterns = fs.readFileSync(filePath, "utf-8").trim().split("\n\n").map(pattern => pattern.split("\n"));

const VERTICAL_MULTIPLIER = 100
const HORIZONTAL_MULTIPLIER = 1
let summaryValue = 0

patterns.forEach(pattern => {
  const verticalSplit = findVerticalSplit(pattern)
  if (verticalSplit) {
    summaryValue += VERTICAL_MULTIPLIER * verticalSplit
    return
  }

  const horizontalSplit = findHorizontalSlit(pattern)
  if (horizontalSplit) {
    summaryValue += HORIZONTAL_MULTIPLIER * horizontalSplit
  }
})

console.log(summaryValue)

function findVerticalSplit(pattern) {
  let mirrored = [pattern[0]]
  let remainingLines = [...pattern.slice(1)]

  while (remainingLines.length > 0) { 
    let isMirror = true

    for (let i = 0; i < Math.min(mirrored.length, remainingLines.length); i++) {
      if (mirrored[i] != remainingLines[i]) {
        isMirror = false
        break
      }
    }

    if (isMirror) { 
      return mirrored.length
    } else {
      mirrored = [remainingLines[0], ...mirrored]
      remainingLines = [...remainingLines.slice(1)]
    }
  }
}

function findHorizontalSlit(pattern) {
  const newPattern = []

  for (let i = 0; i < pattern[0].length; i++) {
    let newString = '';

    for (let j = 0; j < pattern.length; j++) {
      newString += pattern[j][i]
    }

    newPattern.push(newString)
  }

  return findVerticalSplit(newPattern)
}