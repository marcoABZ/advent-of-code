const fs = require('fs');

const filePath = '../demo.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
