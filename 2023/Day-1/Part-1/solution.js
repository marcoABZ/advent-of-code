const fs = require('fs');
const readline = require('readline');

const filePath = './input.txt';
let sum = 0;
const numbers = '0123456789';

function isNumeric(x) {
  return numbers.includes(x);
}

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  const numbers = Array.from(line).filter(x => isNumeric(x));
  const lineNumber = numbers[0] + numbers[numbers.length - 1];
  sum += Number(lineNumber);
});

rl.on('close', () => {
  console.log('Total sum:', sum);
});