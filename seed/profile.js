const axios = require("axios");
const puppeteer = require("puppeteer");
const { accounts } = require("./config");
const fs = require("fs");
const vm = require("vm");

const configPath = "./seed/config.js";

async function getDataInit(account, url) {
  const userProfile = account?.userProfile;

  const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: false,
    userDataDir: userProfile,
  });

  const [page] = await browser.pages(); // This gets the first open page or tab
  await page.goto(url);
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  // await page.close();
  // await browser.close();
}
async function run(index) {
  let account = accounts[index];
  console.log("start account --> ", index);
  const url = "https://web.telegram.org/k/#@seed_coin_bot";
  await getDataInit(account, url);

  console.log("DONE AT ", new Date());
}

run(0);

