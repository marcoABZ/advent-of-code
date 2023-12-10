const fs = require('fs');

const filePath = '../demo.txt';
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
console.log(grid)

allowedConnections[currentPiece].directions.forEach(direction => {
  console.log(currentPosition, direction)
  if (canConnect(currentPiece, currentPosition, direction)) {
    const maxDepth = expandDFS(currentPiece, currentPosition, direction)
  }
});

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

  return allowedConnections[piece].connections[index].includes(grid[position[0] + direction[0]][position[1] + direction[1]])
}

function expandDFS(origin, position, direction) {
  return 0
}