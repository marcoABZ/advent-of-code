const fs = require('fs');

const filePath = '../input.txt';
const [rules, pieces] = fs.readFileSync(filePath, "utf-8").trim().split("\n\n").map(el => el.split("\n"));

const rulesDict = {}
let sum = 0

rules.forEach(rule => {
  const [label, conditions] = rule.split("{")

  rulesDict[label] = conditions.split(",").map(condition => {
    if (condition.endsWith("}")) return {
      destination: condition.slice(0, -1)
    }

    const [comparison, destination] = condition.split(':')

    return {
      criteria: comparison.slice(0, 1),
      condition: comparison.slice(1, 2),
      value: Number(comparison.slice(2)),
      destination: destination
    }
  })
})

pieces.forEach(piece => {
  const [x, m, a, s] = piece.split(",")
  const pieceDetails = {}

  pieceDetails['x'] = Number(x.slice(3))
  pieceDetails['m'] = Number(m.slice(2))
  pieceDetails['a'] = Number(a.slice(2))
  pieceDetails['s'] = Number(s.slice(2, -1))

  let currentRule = rulesDict['in']

  while (true) {
    let index = -1
    for (let i = 0; i < currentRule.length-1; i++) {
      if (currentRule[i].condition == '<'  && pieceDetails[currentRule[i].criteria] < currentRule[i].value) {
        index = i 
        break 
      } else if (currentRule[i].condition == '>' && pieceDetails[currentRule[i].criteria] > currentRule[i].value) {
        index = i
        break
      }
    }

    if (index === -1) index = currentRule.length - 1

    if (currentRule[index].destination === 'A') {
      sum += Object.values(pieceDetails).reduce((prev, curr) => prev + curr, 0)
      break
    } else if (currentRule[index].destination === 'R') {
      break
    } else {
      currentRule = rulesDict[currentRule[index].destination]
    }
  }
})

console.log(sum)
