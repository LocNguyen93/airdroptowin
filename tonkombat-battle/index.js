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

async function callApiFind(account) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://liyue.tonkombat.com/api/v1/combats/find',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `${account?.initData}`, 
      'content-type': 'application/json', 
      'origin': 'https://staggering.tonkombat.com', 
      'priority': 'u=1, i', 
      'referer': 'https://staggering.tonkombat.com/', 
      'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
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

async function callApiFight(account) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://liyue.tonkombat.com/api/v1/combats/fight',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `${account?.initData}`,  
      'content-length': '0', 
      'origin': 'https://staggering.tonkombat.com', 
      'priority': 'u=1, i', 
      'referer': 'https://staggering.tonkombat.com/', 
      'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
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
    const url = "https://web.telegram.org/k/#@Ton_kombat_bot";
    initData = await getDataInit(account, url);
    account.initData = initData;
    while (isRun) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const response = await callApiFind(account);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Find done");
        await new Promise(resolve => setTimeout(resolve, 3000));
        const response = await callApiFight(account);
        console.log("Fight done", response?.data?.rank_gain);
      } 
      else {
        console.log("Find fail", response?.message);
        isRun = false;
      }
    }
    if (initData !== "" && initData != null) {
      writeFile("tonkombat-battle", "config.js", index, initData, "initData");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  },  180 * 1000 * 60);
}

run();
