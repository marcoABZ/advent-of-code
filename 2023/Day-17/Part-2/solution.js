const fs = require('fs');

const filePath = '../input.txt';
const grid = fs.readFileSync(filePath, "utf-8").trim().split("\n").map(line => Array.from(line).map(el => Number(el)));

function MinHeap() {
  this.data = [];
}

MinHeap.prototype.insert = function(val) {
  this.data.push(val);
  this.bubbleUp(this.data.length-1);
};

MinHeap.prototype.bubbleUp = function(index) {
  while (index > 0) {
    var parent = Math.floor((index + 1) / 2) - 1;
    
    if (this.data[parent][2] > this.data[index][2]) {
      var temp = this.data[parent];
      this.data[parent] = this.data[index];
      this.data[index] = temp;
    }
    
    index = parent;
  }
};

MinHeap.prototype.extractMin = function() {
  var min = this.data[0];
  this.data[0] = this.data.pop();
  this.bubbleDown(0);
  
  return min;
};

MinHeap.prototype.bubbleDown = function(index) {
  if (this.data.length === 1) return
  while (true) {
    var child = (index+1)*2;
    var sibling = child - 1;
    var toSwap = null;
    
    if (!this.data[child]) return
    if (this.data[index][2] > (this.data[child][2] ?? 0)) {
      toSwap = child;
    }
    
    if (this.data[index][2] > this.data[sibling][2] && (this.data[child] == null || (this.data[child] !== null && this.data[sibling][2] < this.data[child][2]))) {
        toSwap = sibling;
    }
    
    if (toSwap == null) {
      break;
    }
    
    var temp = this.data[toSwap];
    this.data[toSwap] = this.data[index];
    this.data[index] = temp;
    
    index = toSwap;
  }
};

let frontier = new MinHeap()
frontier.insert([0, 0, 0, -1, 1])
//frontier = [[0,0,0,-1,1]]

let visited = new Set()

while (frontier.length !== 0) {
  const[row, col, dist, dir, dir_count] = frontier.extractMin()
  //const[row, col, dist, dir, dir_count] = frontier.pop()
  console.log(dist)

  if (row === grid.length - 1 && col === grid[0].length - 1) {
    console.log("Aqui", dist, row, col)
    break
  }

  if (visited.has(String([row, col, dir, dir_count]))) continue
  visited.add(String([row, col, dir, dir_count]))

  const expansions = expand(row, col, dist, dir, dir_count, grid)
  //frontier = [...frontier, ...expansions].sort((a, b) => b[2] - a[2])
  expansions.forEach(el => frontier.insert(el))
}

function expand(row, col, dist, dir, dir_count, grid) {
  let destinations;
  let expansions = [];

  destinations = [
    [row, col + 4, dist, 0, 4],
    [row, col + 5, dist, 0, 5],
    [row, col + 6, dist, 0, 6],
    [row, col + 7, dist, 0, 7],
    [row, col + 8, dist, 0, 8],
    [row, col + 9, dist, 0, 9],
    [row, col + 10, dist, 0, 10],
    [row + 4, col, dist, 1, 4],
    [row + 5, col, dist, 1, 5],
    [row + 6, col, dist, 1, 6],
    [row + 7, col, dist, 1, 7],
    [row + 8, col, dist, 1, 8],
    [row + 9, col, dist, 1, 9],
    [row + 10, col, dist, 1, 10],
    [row, col - 4, dist, 2, 4],
    [row, col - 5, dist, 2, 5],
    [row, col - 6, dist, 2, 6],
    [row, col - 7, dist, 2, 7],
    [row, col - 8, dist, 2, 8],
    [row, col - 9, dist, 2, 9],
    [row, col - 10, dist, 2, 10],
    [row - 4, col, dist, 3, 4],
    [row - 5, col, dist, 3, 5],
    [row - 6, col, dist, 3, 6],
    [row - 7, col, dist, 3, 7],
    [row - 8, col, dist, 3, 8],
    [row - 9, col, dist, 3, 9],
    [row - 10, col, dist, 3, 10]
  ]

  destinations.forEach((destination) => {
    if (!isValid([destination[0], destination[1]], grid)) return
    if (destination[3] === dir - 2 || destination[3] === dir + 2) return

    if (destination[3] === dir) destination[4] += dir_count
    if (destination[4] > 10) return

    for (let i = 0; i < destination[4]; i++) {
      if (destination[3] === 0) {
        destination[2] += grid[destination[0]][destination[1]-i]
      } else if (destination[3] === 1) {
        destination[2] += grid[destination[0]-i][destination[1]]
      } else if (destination[3] === 2) {
        destination[2] += grid[destination[0]][destination[1]+i]
      } else {
        destination[2] += grid[destination[0]+i][destination[1]]
      }
    }

    //console.log(row, col, destination)
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
