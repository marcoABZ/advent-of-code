const fs = require('fs');

const filePath = '../input.txt';
const grid = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(line => Array.from(line));

const startPosition = findStartingPosition(grid)
'|', '-', 'F', '7', 'J', 'L'
const allowedConnections = {
  '|': {
    directions: [[-1, 0], [1, 0]],
    connections: [['F', '|', '7'], ['L', 'J', '|']]
  },
  '-': {
    directions: [[0, -1], [0, 1]],
    connections: [['-', 'F', 'L'], ['-', 'J', '7']]
  },
  'F': {
    directions: [[0, 1], [1, 0]],
    connections: [['-', 'J', '7'], ['|', 'J', 'L']] 
  },
  '7': {
    directions: [[0, -1], [1, 0]],
    connections: [['-', 'L', 'F'], ['|', 'J', 'L']]
  },
  'J': {
    directions: [[0, -1], [-1, 0]],
    connections: [['-', 'L', 'F'], ['|', '7', 'F']]
  },
  'L': {
    directions: [[0, 1], [-1, 0]],
    connections: [['-', 'J', '7'], ['|', '7', 'F']] 
  },
  'S': {
    directions: [[0, 1], [0, -1], [1, 0], [-1, 0]],
    connections: [['-', 'J', '7'], ['-', 'L', 'F'], ['|', 'J', 'L'], ['|', '7', 'F']]
  }
}

let currentPiece = 'S'
let currentPosition = startPosition
let depthGrid = []
let maxDepth = 0

for (let i = 0; i < grid.length; i++) {
  let line = [];
  for (let j = 0; j < grid[0].length; j++) {
    line.push(Number.POSITIVE_INFINITY);
  }
  depthGrid.push(line);
}
depthGrid[currentPosition[0]][currentPosition[1]] = 0

allowedConnections[currentPiece].directions.forEach(direction => {
  if (canConnect(currentPiece, currentPosition, direction)) {
    const newPosition = [currentPosition[0] + direction[0], currentPosition[1] + direction[1]]
    expandDFS(newPosition, direction, 1)
  }
});

for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    if (depthGrid[i][j] != Number.POSITIVE_INFINITY) { 
      maxDepth = Math.max(maxDepth, depthGrid[i][j])
    }
  }
}

console.log(maxDepth)

function findStartingPosition(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 'S') {
        return [i, j]
      }
    }
  }
}

function canConnect(piece, position, direction) {
  if (position[0] + direction[0] < 0 || 
      position[0] + direction[0] >= grid[0].length || 
      position[1] + direction[1] < 0 ||
      position[1] + direction[1] >= grid.length) {
      return false
  }
  const directions = allowedConnections[piece].directions
  const index = directions.indexOf(direction)

  if (index === -1) return false

  return allowedConnections[piece].connections[index].includes(grid[position[0] + direction[0]][position[1] + direction[1]])
}

function expandDFS(origin, originDirection, depth) {
  if (depthGrid[origin[0], origin[1]] <= depth) return
  
  depthGrid[origin[0]][origin[1]] = Math.min(depthGrid[origin[0]][origin[1]], depth)
  const piece = grid[origin[0]][origin[1]]

  const directions = allowedConnections[piece].directions
  directions.forEach(direction => {
    if (originDirection[0] === -direction[0] && originDirection[1] === -direction[1]) return

    if (canConnect(piece, origin, direction)) {
      const newPosition = [origin[0] + direction[0], origin[1] + direction[1]]
      expandDFS(newPosition, direction, depth+1)
    }
  }); 
}
