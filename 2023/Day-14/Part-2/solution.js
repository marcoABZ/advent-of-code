const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(line => Array.from(line));
const CYCLES = 1000000000
const rowSize = lines[0].length

let cycles = 0
let grid = []
lines.forEach(line => grid.push([...line]))

let grids = [String(grid)]
let seen = new Set()
seen.add(String(grid))

while (cycles < CYCLES) {
  cycles += 1
  grid = roll(grid)
  if (seen.has(String(grid))) {
    break 
  }

  seen.add(String(grid))
  grids.push(String(grid))
}

let first = grids.indexOf(String(grid))
grid = grids[(CYCLES - first) % (cycles - first) + first].split(",")

var nArr = [];
while(grid.length > 0) {
  nArr.push(grid.splice(0,rowSize));
}

let loadSum = getLoadSum(nArr)
console.log(loadSum)

function roll(grid) {
  return rollEast(rollDown(rollWest(rollUp(grid)))) 
}

function rollUp(grid) {
  let newGrid = []
  grid.forEach(row => newGrid.push([...row]))

  for (let j = 0; j < grid[0].length; j++) {
    let lastCubeShapedRockIndex = 0
    let stackedRoundRocks = 0

    for (let i = 0; i < grid.length; i++) {
      if (grid[i][j] === 'O') {
        newGrid[lastCubeShapedRockIndex + stackedRoundRocks][j] = 'O'
        if (lastCubeShapedRockIndex + stackedRoundRocks !== i) newGrid[i][j] = '.'
        stackedRoundRocks += 1
      } else if (grid[i][j] === '#') {
        lastCubeShapedRockIndex = i + 1
        stackedRoundRocks = 0
      }
    }
  }
  
  return newGrid
}

function rollWest(grid) {
  return transpose(rollUp(transpose(grid)))
}

function rollDown(grid) {
  return reflectVertical(rollUp(reflectVertical(grid)))
}

function rollEast(grid) {
  return reflectHorizontal(transpose(rollUp(transpose(reflectHorizontal(grid)))))
}

function transpose(grid) {
  const transposed = []

  for (let i = 0; i < grid[0].length; i++) {
    let transposedRow = [];

    for (let j = 0; j < grid.length; j++) {
      transposedRow.push(grid[j][i])
    }

    transposed.push(transposedRow)
  }

  return transposed
}

function reflectHorizontal(grid) {
  const reflected = []

  for (let i = 0; i < grid.length; i++) {
    reflected.push([...grid[i]].reverse())
  }

  return reflected
}

function reflectVertical(grid) {
  let reflected = []
  grid.forEach(el => reflected.push([...el]))

  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < grid.length; j++) {
      reflected[i][j] = grid[grid.length - 1 - i][j]
    }
  }

  return reflected 
}

function getLoadSum(grid) {
  const maxLoad = grid.length
  let loadSum = 0

  for (let j = 0; j < grid[0].length; j++) {
    for (let i = 0 ; i < grid.length; i++) {
      if (grid[i][j] === 'O') {
        loadSum += maxLoad - i 
      }
    }
  }
  
  return loadSum  
}
