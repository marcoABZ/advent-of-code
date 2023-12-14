const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");

const maxLoad = lines.length
let loadSum = 0

for (let j = 0; j < lines[0].length; j++) {
  let lastCubeShapedRockIndex = 0
  let stackedRoundRocks = 0

  for (let i = 0 ; i < lines.length; i++) {
    if (lines[i][j] === 'O') {
      loadSum += maxLoad - lastCubeShapedRockIndex - stackedRoundRocks
      stackedRoundRocks += 1 
    } else if (lines[i][j] === '#') {
      lastCubeShapedRockIndex = i + 1
      stackedRoundRocks = 0
    }
  }
}

console.log(loadSum)
