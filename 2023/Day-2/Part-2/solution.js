const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
let sum = 0;

lines.forEach(line => {
  let minimumValues = {
    'red': 0,
    'green': 0,
    'blue': 0
  }

  const [_, rounds] = decomposeLine(line)
  
  rounds.forEach(round => {
    const draws = round.trim().split(",")
    
    draws.forEach(draw => {
      const [total, color] = draw.trim().split(" ");
      minimumValues[color] = Math.max(minimumValues[color], Number(total))
    })
  })

  sum += (minimumValues['red'] * minimumValues['green'] * minimumValues['blue'])
})

console.log(`Total sum: ${sum}`)

function decomposeLine(line) {
  const gameId = line.split(":")[0].split(" ").pop()
  const rounds = line.split(":").pop().split(";")

  return [gameId, rounds]
}
