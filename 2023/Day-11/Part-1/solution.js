const fs = require('fs');

const filePath = '../input.txt';
let grid = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(line => Array.from(line));

grid = expand(grid)
let galaxiesPositions = getGalaxiesPositions(grid)
let distanceSum = getPairwiseDistanceSum(galaxiesPositions)
console.log(distanceSum)

function expand(grid) {
  function expandRows(grid) {
    for (let i = 0; i < grid.length; i++) {
      let emptyRow = true;
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] !== '.') {
          emptyRow = false
          break
        }
      }
  
      if (emptyRow) {
        grid.splice(i, 0, grid[i])
        i++;
      }
    }
  
    return grid
  }

  function expandCols(grid) {
    for (let j = 0; j < grid[0].length; j++) {
      let emptyCol = true;
      for (let i = 0; i < grid.length; i++) {
        if (grid[i][j] !== '.') {
          emptyCol = false
          break
        }
      }
  
      if (emptyCol) {
        for (let i = 0; i < grid.length; i++) {
          grid[i].splice(j, 0, '.')
        }
        j++;
      }
    }
  
    return grid
  }

  return expandCols(expandRows(grid))
}

function getGalaxiesPositions(grid) {
  let positions = []

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '#') {
        positions.push([i, j])
      }
    }
  }

  return positions
}

function getPairwiseDistanceSum(positions) {
  let sum = 0

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      sum += (Math.abs(positions[i][0] - positions[j][0]) + Math.abs(positions[i][1] - positions[j][1]))
    }
  }

  return sum
}

// console.log(grid.length, grid[0].length)

// for(let i = 0; i < grid.length; i++) {
//   for(let j = 0; j < grid[0].length; j++) {
//     process.stdout.write(grid[i][j])
//   }
//   process.stdout.write('\n')
// }

// console.log(galaxiesPositions)