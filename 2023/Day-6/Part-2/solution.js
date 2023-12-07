const fs = require('fs');

const filePath = '../input.txt';

const [time, distance] = 
  fs.readFileSync(filePath, "utf-8")
    .trim()
    .split("\n")
    .map(line => 
      Number(line.split(":")[1]
                 .split(" ")
                 .filter(el => el !== '')
                 .reduce((prev, curr) => prev + curr, ''))
    );

const [minHold, maxHold] = getHoldingLimits(time, distance)
const numberOfPossibilities = (maxHold - minHold + 1)
console.log(numberOfPossibilities)

function getHoldingLimits(time, distance) {
  // Speed will be given by s and the car will run (time - s) seconds.
  // Thus total distance will be s * (time - s).
  // Solved for s * (time - s) > distance. 2nd degree equation.
  const unroundedMax = (time + Math.sqrt(time * time - 4 * distance)) / 2
  const max = unroundedMax % 1 === 0 ? unroundedMax - 1 : Math.floor(unroundedMax)

  const unroundedMin = (time - Math.sqrt(time * time - 4 * distance)) / 2
  const min = unroundedMin % 1 === 0 ? unroundedMin + 1 : Math.ceil(unroundedMin)

  return [min, max]
}