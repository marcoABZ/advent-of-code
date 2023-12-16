const fs = require('fs');

const filePath = '../input.txt';
const steps = fs.readFileSync(filePath, "utf-8").trim().split(',');
let map = new Object();
let hashValuesCache = new Object();

steps.forEach(step => {
  if (step.endsWith("-")) {
    const label = step.split("-")[0]
    remove(label, map)
  } else {
    replaceOrInsert(step, map)
  }
})

console.log(Object.entries(map).reduce((prev, curr) => prev + getCummulativeValue(curr[0], curr[1]), 0))

function hash(step) {
  if (step in hashValuesCache) {
    return hashValuesCache[step]
  }
  let hash = 0;

  for (let i = 0; i < step.length; i++) {
    const ascii = step.charCodeAt(i)
    hash += ascii
    hash *= 17
    hash %= 256
  }

  hashValuesCache[step] = hash
  return hash
}

function replaceOrInsert(step, hashmap) {
  const [label, focalLength] = step.split("=")
  const bin = hash(label)

  if (!hashmap[bin]) { 
    hashmap[bin] = [[label, focalLength]]
    return
  }

  for(let i = 0; i < hashmap[bin].length; i++) {
    if (hashmap[bin][i][0] === label) {
      hashmap[bin][i] = [label, focalLength]
      return
    }
  }

  hashmap[bin].push([label, focalLength])
}

function remove(label, hashmap) {
  const bin = hash(label)

  if (!hashmap[bin]) return

  for(let i = 0; i < hashmap[bin].length; i++) {
    if (hashmap[bin][i][0] === label) {
      hashmap[bin].splice(i, 1)
      return
    }
  }
}

function getCummulativeValue(binNumber, binValues) {
  let sum = 0

  binValues.forEach((el, index) => {
    const [_, focalLength] = el
    sum += (Number(binNumber) + 1) * (index + 1) * focalLength
  })

  return sum
}