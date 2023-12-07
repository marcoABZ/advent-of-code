#!/usr/bin/env node

require('yargs')
  .scriptName("aoc-folder")
  .usage('$0 <cmd> [args]')
  .command('create-folder-structure <year>', 'Creates the entire folder structure for solving Advent of Code on a given year', (yargs) => {
    return yargs.positional('year', {
      type: 'number',
      describe: 'Advent of Code Year'
    })
  }, function (argv) {
    const fs = require('fs');
    const path = require('path');
    const rootDir = process.cwd();

    const yearFolder = path.join(rootDir, `${argv.year}`);
    try {
      if (!fs.existsSync(yearFolder)) {
        fs.mkdirSync(yearFolder, { recursive: true });
      } else {
        console.log(`Folder for year ${argv.year} already exists. Skipping creation.`);
      }
    } catch (err) {
      console.error("Could not create or check year directory", err);
    }

    for (let i = 1; i <= 25; i++) {
      const dayFolder = path.join(rootDir, `${argv.year}/Day-${i}`);
      const part1Folder = path.join(rootDir, `${argv.year}/Day-${i}/Part-1`);
      const part2Folder = path.join(rootDir, `${argv.year}/Day-${i}/Part-2`);
      
      try {
        fs.mkdirSync(dayFolder, { recursive: true });
        fs.mkdirSync(part1Folder, { recursive: true }); 
        fs.mkdirSync(part2Folder, { recursive: true }); 
      } catch (err) {
        console.error(`Could not create or check directory ./${argv.year}/Day-${i}`, err);
        continue;
      }

      const demoFilePath = path.join(rootDir, `./${argv.year}/Day-${i}/demo.txt`);
      try {
        if (!fs.existsSync(demoFilePath)) {
          fs.closeSync(fs.openSync(demoFilePath, 'w'));
        } else {
          console.log(`demo.txt file already existed for day ${i}. Skipping creation.`)
        }
      } catch (err) {
        console.error(`Could not create or check file ${demoFilePath}`, err);
      }

      const solution1FilePath = path.join(rootDir, `./${argv.year}/Day-${i}/Part-1/solution.js`);
      const solution2FilePath = path.join(rootDir, `./${argv.year}/Day-${i}/Part-2/solution.js`);
      try {
        if (!fs.existsSync(solution1FilePath)) {
          const writeStream = fs.createWriteStream(solution1FilePath);

          writeStream.write("const fs = require('fs');\n\n");
          writeStream.write("const filePath = '../demo.txt';\n");
          writeStream.write(`const lines = fs.readFileSync(filePath, "utf-8").trim().split("\\n");\n`);
  
          writeStream.end();
        } else {
          console.log(`Solution file for day ${i} part 1 already existed. Skipping creation.`)
        };

        if (!fs.existsSync(solution2FilePath)) {
          const writeStream = fs.createWriteStream(solution2FilePath);

          writeStream.write("const fs = require('fs');\n\n");
          writeStream.write("const filePath = '../demo.txt';\n");
          writeStream.write(`const lines = fs.readFileSync(filePath, "utf-8").trim().split("\\n");\n`);
  
          writeStream.end();
        } else {
          console.log(`Solution file for day ${i} part 2 already existed. Skipping creation.`)
        };
      } catch (err) {
        console.error(`Could not create or write to file ${solution1FilePath}`, err);
      }
    }
  })
  .command('get-input <year> <day>', 'Creates an input.txt file with the input file for the given year and day Advent of Code task', (yargs) => {
    return yargs.positional('year', {
      type: 'number',
      describe: 'Advent of Code Year'
    }).positional('day', {
      type: 'number',
      describe: 'Day of the task'
    })
  }, function (argv) { 
    const https = require('https');
    const fs = require('fs');
    const path = require('path');
    const rootDir = process.cwd();
    const AOC_SESSION_KEY = "53616c7465645f5f6cf402b05b5aae5a2bb9fc156358c10687685454e4d8ca20aca100b8130949bab3a0141c1fc1cb69142e5221ffb365084ba37bbe5bd04536"
    
    const inputFilePath = path.join(rootDir, `./${argv.year}/Day-${argv.day}/input.txt`);
    const url = `https://adventofcode.com/${argv.year}/day/${argv.day}/input`;

    const options = {
      rejectUnauthirized: false,
      headers: {
        'Cookie': `session=${AOC_SESSION_KEY}`
      }
    }

    https.get(url, options, (response) => {
      let data = '';
    
      response.on('data', (chunk) => {
        data += chunk;
      });
    
      response.on('end', () => {
        fs.writeFile(inputFilePath, data, (err) => {
          if (err) {
            console.error(`Error writing to file: ${err.message}`);
          } else {
            console.log('Data has been written to input.txt');
          }
        });
      });
    }).on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });
  })
  .help()
  .argv
