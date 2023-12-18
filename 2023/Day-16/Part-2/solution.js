const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(el => Array.from(el));

let startingBeams = generateStartingBeams(lines)
let maxEnergy = 0

while (startingBeams.length !== 0) {
  let beams = startingBeams.pop()

  let energized = []
  let seen = new Set()
  lines.forEach(el => energized.push([...el]))

  while (beams.length !== 0) {
    let currBeam = beams.pop()
  
    if (seen.has(String(currBeam.position) + currBeam.direction)) {
      continue
    }
    seen.add(String(currBeam.position) + currBeam.direction)
    
    energized[currBeam.position[0]][currBeam.position[1]] = "#"
    
    let expansions = expand(currBeam)
    beams = [...beams, ...expansions]
  }
  
  const energizedCount = energized.reduce((prev, curr) => prev + curr.reduce((prev, curr) => prev + (curr === '#'), 0), 0)
  maxEnergy = Math.max(maxEnergy, energizedCount)
}

console.log(maxEnergy)

// energized.forEach(el => {
//   el.forEach(cell => {
//     process.stdout.write(cell)
//   })
//   process.stdout.write("\n")
// })



function generateStartingBeams(grid) {
  let beams = []

  for (let j = 0; j < grid[0].length; j++) {
    let directions = getStartingDirection(grid[0][j], "v")
    let start = []
    directions.forEach(dir => start.push({position: [0, j], direction: dir}))
    beams.push(start)

    directions = getStartingDirection(grid[grid.length - 1][j], "^")
    start = []
    directions.forEach(dir => start.push({position: [grid.length - 1, j], direction: dir}))
    beams.push(start)
  }

  for (let i = 0; i < grid.length; i++) {
    let directions = getStartingDirection(grid[i][0], "->")
    let start = []
    directions.forEach(dir => start.push({position: [i, 0], direction: dir}))
    beams.push(start)

    directions = getStartingDirection(grid[i][grid[0].length - 1], "<-")
    start = []
    directions.forEach(dir => start.push({position: [i, grid[0].length - 1], direction: dir}))
    beams.push(start)
  }
  
  return beams
}

function getStartingDirection(startingCell, direction) {
  switch (direction) {
    case "v":
      switch (startingCell) {
        case ".":
        case "|":
          return [direction]
        case "\\":
          return ["->"]
        case "/":
          return ["<-"]
        case "-":
          return ["<-", "->"]
      }
    case "^":
      switch (startingCell) {
        case ".":
        case "|":
          return [direction]
        case "\\":
          return ["<-"]
        case "/":
          return ["->"]
        case "-":
          return ["<-", "->"]
      }
    case "->":
      switch (startingCell) {
        case ".":
        case "-":
          return [direction]
        case "\\":
          return ["v"]
        case "/":
          return ["^"]
        case "|":
          return ["v", "^"]
      }
    case "<-":
      switch (startingCell) {
        case ".":
        case "-":
          return [direction]
        case "\\":
          return ["^"]
        case "/":
          return ["v"]
        case "|":
          return ["v", "^"]
      }
  }

}

function expand(beam) {
  const position = getNewPosition(beam.position, beam.direction)
  
  if (isValid(position, lines)) {
    const resultingBeams = getResultingBeamsDirections(position, beam.direction, lines)
    return resultingBeams.map(dir => { return { position: position, direction: dir }})
  }

  return []
}

function getNewPosition(position, direction) {
  if (direction === "->") return [position[0], position[1] + 1]
  if (direction === "<-") return [position[0], position[1] - 1]
  if (direction === "^") return [position[0] - 1, position[1]]
  if (direction === "v") return [position[0] + 1, position[1]]
}

function isValid(position, grid) {
  return position[0] >= 0 && position[0] < grid.length && position[1] >= 0 && position[1] < grid[0].length
}

function getResultingBeamsDirections(position, direction, grid) {
  const cell = grid[position[0]][position[1]]

  if (cell === '.') return [direction]
  if (cell === '/') {
    switch (direction) {
      case "->": return ["^"]
      case "<-": return ["v"]
      case "^": return ["->"]
      case "v": return ["<-"]
    }
  }
  if (cell === "\\") {
    switch (direction) {
      case "->": return ["v"]
      case "<-": return ["^"]
      case "^": return ["<-"]
      case "v": return ["->"]
    }
  }
  if (cell === "|") {
    switch (direction) {
      case "->":
      case "<-":
        return ["^", "v"]
      case "^":
      case "v":
        return [direction]
    }
  }
  if (cell === "-") {
    switch (direction) {
      case "->":
      case "<-":
        return [direction]
      case "^":
      case "v":
        return ["<-", "->"]
    }
  }
}