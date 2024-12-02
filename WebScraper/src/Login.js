const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const { writeToLogFile } = require('./logs.js');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login() {

}

module.exports = login;
