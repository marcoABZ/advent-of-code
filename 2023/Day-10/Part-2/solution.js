const fs = require('fs');

const filePath = '../input.txt';
const grid = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(line => Array.from(line));

const startPosition = findStartingPosition(grid)
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
let edgeCoordinates = [startPosition]
let boundaryPoints = 1
let loop = false

allowedConnections[currentPiece].directions.forEach(direction => {
  if (canConnect(currentPiece, currentPosition, direction)) {
    const newPosition = [currentPosition[0] + direction[0], currentPosition[1] + direction[1]]
    if (['F', '7', 'J', 'L'].includes(grid[newPosition[0]][newPosition[1]])) edgeCoordinates.push(newPosition)
    boundaryPoints += 1
    expandDFS(newPosition, direction, 1)
    edgeCoordinates.push(startPosition)
    console.log(getArea(edgeCoordinates, boundaryPoints))
    edgeCoordinates = [startPosition]
    boundaryPoints = 1
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
      position[0] + direction[0] >= grid.length || 
      position[1] + direction[1] < 0 ||
      position[1] + direction[1] >= grid[0].length) {
      return false
  }
  const directions = allowedConnections[piece].directions
  const index = directions.indexOf(direction)

  if (index === -1) return false

  return allowedConnections[piece].connections[index].includes(grid[position[0] + direction[0]][position[1] + direction[1]])
}

function expandDFS(origin, originDirection, depth) {
  const piece = grid[origin[0]][origin[1]]
  if (piece === 'S') { 
    if (loop) return
    loop = true 
  } 

  const directions = allowedConnections[piece].directions
  directions.forEach(direction => {
    if (originDirection[0] === -direction[0] && originDirection[1] === -direction[1]) return

    if (canConnect(piece, origin, direction)) {
      const newPosition = [origin[0] + direction[0], origin[1] + direction[1]]
      if (['F', '7', 'J', 'L'].includes(grid[newPosition[0]][newPosition[1]])) edgeCoordinates.push(newPosition)
      boundaryPoints += 1
      expandDFS(newPosition, direction, depth+1)
    }
  }); 
}

function getArea(edgeCoordinates, boundaryPoints) {
  function shoelaceArea(coordinates) {
    let area = 0
  
    for (let i = 0; i < coordinates.length - 1; i++) {
      area += coordinates[i][0] * coordinates[i + 1][1] - coordinates[i][1] * coordinates[i + 1][0]
    }
  
    return Math.abs(area / 2)
  }

  function getInnerPoints(area, boundaryPoints) {
    return area - boundaryPoints / 2 + 1
  }
  
  const area = shoelaceArea(edgeCoordinates)
  const innerPoints = getInnerPoints(area, boundaryPoints)
  return [innerPoints + boundaryPoints, innerPoints]
}