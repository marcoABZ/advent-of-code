const fs = require('fs');

const filePath = '../input.txt';
const [pathPartial, mappingsPartial] = fs.readFileSync(filePath, "utf-8").trim().split("\n\n");

const mapDict = {}
const mappings = mappingsPartial.split("\n")
const path = Array.from(pathPartial)

let currentPositions = [];
let i = 0;

mappings.forEach((map) => {
  const [origin, connections] = map.split("=")
  const [left, right] = connections.split(',')

  mapDict[origin.trim()] = { left: left.replace("(", "").trim(), right: right.replace(")", "").trim() }
  if (origin.trim().endsWith('A')) currentPositions.push(origin.trim())
})

while (!isGoalPosition(currentPositions)) {
  currentPositions = currentPositions.map(position => {
    if (path[i % path.length] === 'R') {
      return mapDict[position].right 
    } else {
      return mapDict[position].left
    }
  })

  i+=1
}

function isGoalPosition(currentPositions) {
  let isGoal = true;

  currentPositions.forEach(position => {
    if (!position.endsWith('Z')) isGoal = false;
  })

  return isGoal;
}

console.log(i);