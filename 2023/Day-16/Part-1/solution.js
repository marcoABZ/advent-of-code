const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(el => Array.from(el));

let energized = []
let seen = new Set()
lines.forEach(el => energized.push([...el]))

let beams = [
  {
    position: [0,0],
    direction: getStartingDirection(lines[0][0])
  }
]

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

// energized.forEach(el => {
//   el.forEach(cell => {
//     process.stdout.write(cell)
//   })
//   process.stdout.write("\n")
// })

console.log(energized.reduce((prev, curr) => prev + curr.reduce((prev, curr) => prev + (curr === '#'), 0), 0))

function getStartingDirection(startingCell) {
  switch (startingCell) {
    case ".":
    case "-":
      return "->"
    case "\\":
    case "|":
      return "v"
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