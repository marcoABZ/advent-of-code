const fs = require('fs');

const filePath = '../input.txt';
const sequences = fs.readFileSync(filePath, "utf-8").trim().split("\n");
let nextValues = [];

sequences.forEach(sequence => {
  nextValues.push(getNextValue(sequence));
})

console.log(nextValues.reduce((a, b) => a + b, 0))

function getNextValue(sequence) {
  let sequences = [sequence.split(" ").map(value => Number(value))]
  let currentSequence = sequence.split(" ").map(value => Number(value))
  
  while (!isFinal(currentSequence)) {
    let nextSequence = getDiffSequence(currentSequence)
    sequences.push(nextSequence)
    currentSequence = nextSequence
  }

  sequences[sequences.length - 1].push(0)

  for (let i = sequences.length - 2; i >= 0; i--) {
    sequences[i].push(sequences[i+1][sequences[i+1].length - 1] + sequences[i][sequences[i].length - 1])
  }

  return sequences[0][sequences[0].length - 1]
}

function isFinal(sequence) {
  return sequence.filter(a => a !== 0).length === 0
}

function getDiffSequence(sequence) {
  let diffSequence = []

  for(let i = 0; i < sequence.length - 1; i++) {
    diffSequence.push(sequence[i+1] - sequence[i])
  }

  return diffSequence
}