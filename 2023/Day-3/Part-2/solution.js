const fs = require('fs');

const filePath = '../input.txt';
const grid = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(line => { return Array.from(line) });
let sum = 0;

const rows = grid.length;
const cols = grid[0].length;

for(let i = 0; i < rows; i++) {
  for(let j = 0; j < cols; j++) {
    if (grid[i][j] === '*') {
      checkGear(i, j)
    }
  }
}

console.log(sum)

function checkGear(i, j) {
  let partNumbers = new Set()

  partNumbers.add(getNumber(i-1, j-1))
  partNumbers.add(getNumber(i, j-1))
  partNumbers.add(getNumber(i+1, j-1))
  partNumbers.add(getNumber(i-1, j))
  partNumbers.add(getNumber(i-1, j+1))
  partNumbers.add(getNumber(i, j+1))
  partNumbers.add(getNumber(i+1, j))
  partNumbers.add(getNumber(i+1, j+1))
  partNumbers.delete(undefined)
  
  if (partNumbers.size === 2) {
    sum += Array.from(partNumbers).reduce((p, c) => p * c, 1)
  }
}

function getNumber(i, j) {
  if (i >= rows || j >= cols || i < 0 || j < 0) return
  if (!Number(grid[i][j]) && grid[i][j] !== '0') return 

  let number = getNumberBackwards(i, j)
  number = getNumberForwards(i, j+1, number)
  return number
}

function getNumberBackwards(i, j) {
  let number = Number(grid[i][j])
  let values = 1
  let idx = j - 1

  while(idx >= 0 && (Number(grid[i][idx]) === 0 || Number(grid[i][idx]))) {
    number += Math.pow(10, values) * Number(grid[i][idx])
    idx -= 1
    values += 1
  }

  return number
}

function getNumberForwards(i, j, number = 0) {
  let idx = j 

  while(idx < grid[i].length && (Number(grid[i][idx]) === 0 || Number(grid[i][idx]))) {
    number = number * 10 + Number(grid[i][idx])
    idx += 1
  }

  return number
}