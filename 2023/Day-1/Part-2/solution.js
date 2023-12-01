const fs = require('fs');
const readline = require('readline');

const filePath = './input.txt';
let sum = 0;
const numbers = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  'zero': '0',
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
};

function isNumeric(x) {
  for (const [key, value] of Object.entries(numbers)) {
    if (x.startsWith(key)) {
      return value;
    }
  }

  return null;
}

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  let numbers = [];

  for (let i = 0; i <= line.length; i++) {
    let number = isNumeric(line.substring(i));
    if (number !== null) {
      numbers.push(number)
    }
  }
  const lineNumber = numbers[0] + numbers[numbers.length - 1];
  sum += Number(lineNumber);
});

rl.on('close', () => {
  console.log('Total sum:', sum);
});