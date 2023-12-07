const fs = require('fs');

const filePath = '../demo.txt';

const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n\n");

const seeds = lines[0].split(":")[1].trim().split(" ").map(seed => Number(seed))
const finalMapping = [];

getFinalMapping(lines);

let closestSeed;
let closestLocation = Number.POSITIVE_INFINITY;

for(let i = 0; i < seeds.length; i+=2) {
  const start = seeds[i];
  const span = seeds[i+1];

  for(let j = 0; j < span; j++) {
    const seedNumber = start+j;

    const location = getLocation(seedNumber)
    if (location < closestLocation) {
      closestSeed = seedNumber;
      closestLocation = location;
    }
  }
}

console.log(closestLocation);

function getFinalMapping(maps) {
  let currentMapIndex = 1;

  while(currentMapIndex < maps.length) {
    const map = maps[currentMapIndex]
    const values = map.split(":")[1].trim().split("\n").map(el => el.split(" ").map(v => Number(v)))

    values.forEach(rangeDetails => {
      const [destination_range_start, source_range_start, range_length] = rangeDetails;
      finalMapping.push([source_range_start, source_range_start + range_length - 1, destination_range_start - source_range_start]);
    })

    currentMapIndex += 1
  }

  finalMapping.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0]
    return a[1] - b[1] 
  })

  console.log(finalMapping)
}

function mergeIntervals(intervals) {
  let i = 0;

  while (i < intervals.length) {
    if (overlap(intervals[i], intervals[i+1])) {
      
    }
  }
}

function overlap(a, b) {
  return (a[0] <= b[0] && a[1] >= b[0]) || (b[0] <= a[0] && b[1] >= a[0])
}

function getLocation(seed) {
  let value = 0;
  return seed + finalMapping[seed];
}
