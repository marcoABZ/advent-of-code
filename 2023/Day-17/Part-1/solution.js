const fs = require('fs');

const filePath = '../input.txt';
const grid = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(line => Array.from(line).map(el => Number(el)));

let distances = []
grid.forEach(row => distances.push(Array(row.length).fill(Number.POSITIVE_INFINITY)))

let frontier = [[0, 0, 0, 0, 1], [0, 0, 0, 1, 1]]
let visited = new Set()

while (frontier.length !== 0) {
  const[row, col, dist, dir, dir_count] = frontier.pop()
  //console.log(dist)

  if (row === grid.length - 1 && col === grid[0].length - 1) {
    console.log(dist)
    break
  }

  if (visited.has(String([row, col, dir, dir_count]))) continue
  visited.add(String([row, col, dir, dir_count]))

  const expansions = expand(row, col, dist, dir, dir_count, grid)
  frontier = [...frontier, ...expansions].sort((a, b) => b[2] - a[2])
}

function expand(row, col, dist, dir, dir_count, grid) {
  let destinations;
  let expansions = [];

  destinations = [
    [row, col + 1, dist, 0, 1],
    [row + 1, col, dist, 1, 1],
    [row, col - 1, dist, 2, 1],
    [row - 1, col, dist, 3, 1]
  ]

  destinations.forEach((destination, index) => {
    if (index === dir - 2 || index === dir + 2) return
    if (!isValid([destination[0], destination[1]], grid)) return

    destination[2] += grid[destination[0]][destination[1]]
    if (destination[3] === dir) {
      destination[4] = dir_count + 1
      if (destination[4] >= 4) return
    }

    expansions.push(destination)
  })

  return expansions
}

function isValid(position, grid) {
  return position[0] >= 0 && position[0] < grid.length && position[1] >= 0 && position[1] < grid[0].length
}

function logGrid(grid, sep="") {
  grid.forEach(line => {
    line.forEach(cell => {
      process.stdout.write(cell + sep)
    }) 
    process.stdout.write("\n")
  })
}
