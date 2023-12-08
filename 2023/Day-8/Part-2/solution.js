const fs = require('fs');

const filePath = '../input.txt';
const [pathPartial, mappingsPartial] = fs.readFileSync(filePath, "utf-8").trim().split("\n\n");

const mapDict = {}
const mappings = mappingsPartial.split("\n")
const path = Array.from(pathPartial)

let currentPosition = 'AAA';
let destination = 'ZZZ';
let i = 0;

mappings.forEach((map, index) => {
  const [origin, connections] = map.split("=")
  const [left, right] = connections.split(',')

  mapDict[origin.trim()] = { left: left.replace("(", "").trim(), right: right.replace(")", "").trim() }
})

while (currentPosition !== destination) {

  if (path[i % path.length] === 'R') {
    currentPosition = mapDict[currentPosition].right 
  } else {
    currentPosition = mapDict[currentPosition].left
  }

  i+=1
}

console.log(i);