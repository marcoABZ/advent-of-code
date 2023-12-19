const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");

const [coordinates, boundaryPoints] = fillGrid(lines)
const area = getArea(coordinates, boundaryPoints)
console.log(area)

function fillGrid(instructions) {
  let currWidth = 0
  let currHeight = 0
  let coordinates = [[0, 0]]
  let boundaryPoints = 0

  instructions.forEach((instruction) => {
    const [direction, count, _] = instruction.split(" ")

    switch (direction) {
      case 'R':
        currWidth += Number(count)
        break
      case 'L':
        currWidth -= Number(count)
        break
      case 'U':
        currHeight -= Number(count)
        break
      case 'D':
        currHeight += Number(count)
        break
    }

    coordinates.push([currHeight, currWidth])
    boundaryPoints += Number(count)
  })

  return [coordinates, boundaryPoints]
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
  return innerPoints + boundaryPoints
}

function logGrid(grid, sep="") {
  grid.forEach(line => {
    line.forEach(cell => {
      process.stdout.write(cell + sep)
    }) 
    process.stdout.write("\n")
  })
}
