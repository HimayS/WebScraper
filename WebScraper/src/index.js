const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const login = require('./Login.js');
const extractData = require('./ExtractData.js');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const { writeToLogFile } = require('./logs.js');



async function runPuppeteer(Flag, arg1) {

  writeToLogFile('Starting...');

}

module.exports = { runPuppeteer };