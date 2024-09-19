const axios = require("axios");
const { getDateTimeLocal, writeFile } = require("../common");
const { accounts } = require("./config");
const puppeteer = require('puppeteer');

async function getDataInit(account, url) {
  const userProfile = account?.userProfile;

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: userProfile
  });

  const page = await browser.newPage();

  await page.goto(url);
  await new Promise(resolve => setTimeout(resolve, 5000));
  await page.waitForSelector('#column-center > div > div > div.bubbles.has-groups.has-sticky-dates.scrolled-down > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div > div > div.reply-markup > div:nth-child(1) > button');

  await page.evaluate(() => {
    const element = document.querySelector('#column-center > div > div > div.bubbles.has-groups.has-sticky-dates.scrolled-down > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div > div > div.reply-markup > div:nth-child(1) > button');
    if (element) {
      element.click(); // Click on the button if found
    }
  });

  let initData = null;
  page.on('response', async response => {
    const request = response.request();
    const headers = request.headers();
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (headers['authorization']) {
      initData = headers['authorization'];
    }
  });
  await new Promise(resolve => setTimeout(resolve, 10000));
  await page.close();
  await browser.close();
  return initData;
};

async function callApiClaim(account) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://liyue.tonkombat.com/api/v1/users/claim',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'en-US,en;q=0.9', 
      'authorization': `${account?.initData}`, 
      'content-length': '0', 
      'origin': 'https://staggering.tonkombat.com', 
      'priority': 'u=1, i', 
      'referer': 'https://staggering.tonkombat.com/', 
      'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'document', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    }
  };

  var result = await axios
    .request(config)
    .then((response) => {
      return { statusCode: response?.status, ...response.data };
    })
    .catch(async (error) => {
      return { statusCode: error?.response?.status };
    });

  return result;
}

async function run() {
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);
    let isRun = true;
    let initData = "";
    while (isRun) {
      const response = await callApiClaim(account);
      console.log("callApiClaim", response);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Claim done", response);
        isRun = false;
      } else if (response?.statusCode === 400 || response?.statusCode === 401) {
        console.log("Re-login");
        const url = "https://web.telegram.org/k/#@Ton_kombat_bot";
        console.log("start account --> ", index);
        initData = await getDataInit(account, url);
        account.initData = initData;
        const response = await callApiClaim(account);
        console.log("Claim done", response);
        isRun = false;
      } else if (response?.statusCode === 500) {
        console.log(response?.message);
        isRun = false;
      }
      else {
        console.log("Job fail", response);
        isRun = false;
      }
    }
    if (initData !== "" && initData != null) {
      writeFile("tonkombat", "config.js", index, initData, "initData");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  },  50 * 1000 * 60);
}

run();
