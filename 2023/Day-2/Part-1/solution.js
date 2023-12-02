const fs = require('fs');

const filePath = './input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
let sum = 0;
limits = {
  "red": 12,
  "green": 13,
  "blue": 14,
}

lines.forEach(line => {
  const [id, rounds] = decomposeLine(line)
  
  let valid = true;
  rounds.forEach(round => {
    if (!isValid(round)) {
      valid = false;
      return
    }
  })

  if (valid) {
    sum += Number(id)
  }
})

console.log(`Total sum: ${sum}`)

function decomposeLine(line) {
  const gameId = line.split(":")[0].split(" ").pop()
  const rounds = line.split(":").pop().split(";")

  return [gameId, rounds]
}

function isValid(round) {
  const draws = round.trim().split(",")
  let valid = true;

  draws.forEach(draw => {
    const [total, color] = draw.trim().split(" ");
    if (Number(total) > limits[color]) {
      valid = false
      return
    }
  })

  return valid
}