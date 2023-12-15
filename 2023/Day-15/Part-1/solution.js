const fs = require('fs');

const filePath = '../input.txt';
const steps = fs.readFileSync(filePath, "utf-8").trim().split(',');

console.log(steps.reduce((prev, curr) => prev + hash(curr), 0))

function hash(step) {
  let hash = 0;

  for (let i = 0; i < step.length; i++) {
    const ascii = step.charCodeAt(i)
    hash += ascii
    hash *= 17
    hash %= 256
  }

  return hash
}
