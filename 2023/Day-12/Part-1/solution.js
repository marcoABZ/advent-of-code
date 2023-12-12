const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
let possibilitiesCount = 0

lines.forEach((line, idx) => {
  const [springsStatePartial, damagedGroupsSizesPartial] = line.split(" ")
  const springsState = Array.from(springsStatePartial)
  const damagedGroupsSizes = damagedGroupsSizesPartial.split(',').map(size => Number(size))
  let possibilities = [springsState]

  for (let i = 0; i < springsState.length; i++) {
    if (springsState[i] === '?') {
      let newPossibilities = []

      possibilities.forEach(val => {
        newPossibilities.push([...val.slice(0, i), '.', ...val.slice(i+1)])
        newPossibilities.push([...val.slice(0, i), '#', ...val.slice(i+1)])
      })

      possibilities = newPossibilities
    }
  }

  possibilities.forEach(possibility => {
    let damagedGroups = []
    let inGroup = false
    let count = 0

    for (let i = 0; i < possibility.length; i++) {
      if (possibility[i] === '#') {
        inGroup = true
        count += 1
      } else if (inGroup) {
        damagedGroups.push(count)
        count = 0
        inGroup = false
      }
    }
    if (count !== 0) damagedGroups.push(count)

    if (damagedGroups.length !== damagedGroupsSizes.length) return
    
    for (let i = 0; i < damagedGroups.length; i++) {
      if (damagedGroups[i] !== damagedGroupsSizes[i]) {
        return
      }
    }
    
    possibilitiesCount += 1
  })
})

console.log(possibilitiesCount)