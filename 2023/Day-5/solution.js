const fs = require('fs');

const filePath = './input.txt';

const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n\n");

const seeds = lines[0].split(":")[1].trim().split(" ").map(seed => Number(seed))
let closestSeed;
let closestLocation = Number.POSITIVE_INFINITY;

seeds.forEach(seed => {
  const location = getLocation(seed, lines)
  //console.log(seed, location)
  if (location < closestLocation) {
    closestSeed = seed;
    closestLocation = location;
  }
})

console.log(closestLocation);

function getLocation(seed, maps) {
  let value = seed;
  let currentMapIndex = 1;

  while(currentMapIndex < maps.length) {
    const map = maps[currentMapIndex]
    const mapName = map.split(":")[0].trim()
    const values = map.split(":")[1].trim().split("\n").map(el => el.split(" ").map(v => Number(v)))
    let found = false;

    values.forEach(rangeDetails => {
      if (found) return;

      const [destination_range_start, source_range_start, range_length] = rangeDetails;
      if (isInRange(value, source_range_start, range_length)) {
        //console.log(`
        //  Match: ${mapName} for ${value} at range ${source_range_start}-${source_range_start+range_length-1} 
        //  starting at ${destination_range_start}. Attributing value ${destination_range_start + (value - source_range_start)}`
        //);
        value = destination_range_start + (value - source_range_start);
        found = true;
      } 
    })

    currentMapIndex += 1
  }

  return value
}

function isInRange(value, range_start, range_length) {
  if (value < range_start) return false;
  if (value >= range_start + range_length) return false;
  return true
}