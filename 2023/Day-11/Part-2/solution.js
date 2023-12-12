const fs = require('fs');

const filePath = '../input.txt';
let grid = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(line => Array.from(line));
let EXPANSION_SCALE = 1000000

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
        grid.splice(i, 1, Array.from('*'.repeat(grid[0].length)))
      }
    }
  
    return grid
  }

  function expandCols(grid) {
    for (let j = 0; j < grid[0].length; j++) {
      let emptyCol = true;
      for (let i = 0; i < grid.length; i++) {
        if (grid[i][j] === '#') {
          emptyCol = false
          break
        }
      }
  
      if (emptyCol) {
        for (let i = 0; i < grid.length; i++) {
          grid[i].splice(j, 1, '*')
        }
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
  function calculateDistance(origin, destination) {
    let distance = 0
    let [startX, endX] = [origin[0], destination[0]].sort((a, b) => a - b)
    let [startY, endY] = [origin[1], destination[1]].sort((a, b) => a - b)

    for(let i = startX + 1; i <= endX; i++) {
      if (grid[i][origin[1]] === '*') {
        distance += EXPANSION_SCALE
      } else {
        distance += 1
      }
    }

    let xDist = distance

    for(let j = startY + 1; j <= endY; j++) {
      if (grid[origin[0]][j] === '*') {
        distance += EXPANSION_SCALE
      } else {
        distance += 1
      }
    }

    return distance
  }

  let sum = 0

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      let distance = calculateDistance(positions[i], positions[j])
      sum += distance
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