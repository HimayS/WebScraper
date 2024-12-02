const { runPuppeteer } = require('./index.js');

// Get command-line arguments
const args = process.argv.slice(2);
console.log(args);

// Expecting the first argument to be a number
const args1 = args[0];

runPuppeteer(false,  args1);