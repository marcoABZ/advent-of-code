const fs = require('fs');

const filePath = './input.txt';
const grid = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(line => { return Array.from(line) });
let sum = 0;
let currentNumber = 0;
let visited = [];

const rows = grid.length;
const cols = grid[0].length;

for(let i = 0; i < rows; i++) {
  for(let j = 0; j < cols; j++) {
    if (Number(grid[i][j])) {
      currentNumber = Number(grid[i][j])
      visited = [];
      const shouldAdd = visit_DFS(grid, i, j, false)
      if (shouldAdd) sum += currentNumber
    }
  }
}

console.log(sum)

function visit_DFS(grid, i, j, isRight=false) {
  if (i >= rows || j >= cols || i < 0 || j < 0) return false
  if (grid[i][j] === '.') return false
  if (visited.includes((i, j))) return false
  if (!Number(grid[i][j]) && grid[i][j] !== '0') return true 

  if (isRight) {
    currentNumber = currentNumber * 10 + Number(grid[i][j])
    grid[i][j] = '.'
  }

  visited.push([i, j]);

  if (visit_DFS(grid, i, j+1, true)) return true  //Right
  if (visit_DFS(grid, i+1, j+1)) return true      //Bellow Right
  if (visit_DFS(grid, i+1, j-1)) return true      //Bellow Left
  if (visit_DFS(grid, i+1, j)) return true        //Bellow
  if (visit_DFS(grid, i, j-1)) return true        //Left
  if (visit_DFS(grid, i-1, j-1)) return true      //Above Left
  if (visit_DFS(grid, i-1, j)) return true        //Above
  if (visit_DFS(grid, i-1, j+1)) return true      //Above Right
}