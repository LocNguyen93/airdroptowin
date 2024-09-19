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
  await page.waitForSelector('#column-center > div > div.chat.tabs-tab.can-click-date.active > div.bubbles.has-groups.has-sticky-dates.scrolled-down > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div > div > div.reply-markup > div > button.is-web-view.is-last.reply-markup-button.rp');

  await page.evaluate(() => {
    const element = document.querySelector('#column-center > div > div.chat.tabs-tab.can-click-date.active > div.bubbles.has-groups.has-sticky-dates.scrolled-down > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div > div > div.reply-markup > div > button.is-web-view.is-last.reply-markup-button.rp');
    if (element) {
      element.click(); // Click on the button if found
    }
  });

  await page.evaluate(() => {
    const element = document.querySelector('body > div.popup.popup-peer.popup-confirmation.active > div > div.popup-buttons > button:nth-child(1)');
    if (element) {
      element.click(); 
    }
  });

  let initData = null;
  page.on('response', async response => {
    const request = response.request();
    const headers = request.headers();
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (headers['telegram-init-data']) {
      initData = headers['telegram-init-data'];
    }
  });
  await new Promise(resolve => setTimeout(resolve, 10000));
  await page.close();
  await browser.close();
  return initData;
};


async function callApiClaim(account) {
  let data = JSON.stringify([
    {
      "operationName": "TapbotClaim",
      "variables": {},
      "query": "fragment FragmentTapBotConfig on TelegramGameTapbotOutput {\n  damagePerSec\n  endsAt\n  id\n  isPurchased\n  startsAt\n  totalAttempts\n  usedAttempts\n  __typename\n}\n\nmutation TapbotClaim {\n  telegramGameTapbotClaimCoins {\n    ...FragmentTapBotConfig\n    __typename\n  }\n}"
    }
  ]);
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api-gw-tg.memefi.club/graphql',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `Bearer ${account?.authorization}`, 
      'content-type': 'application/json', 
      'origin': 'https://tg-app.memefi.club', 
      'priority': 'u=1, i', 
      'referer': 'https://tg-app.memefi.club/', 
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    },
    data : data
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

async function callApiStartClaim(account) {
  let data = JSON.stringify([
    {
      "operationName": "TapbotStart",
      "variables": {},
      "query": "fragment FragmentTapBotConfig on TelegramGameTapbotOutput {\n  damagePerSec\n  endsAt\n  id\n  isPurchased\n  startsAt\n  totalAttempts\n  usedAttempts\n  __typename\n}\n\nmutation TapbotStart {\n  telegramGameTapbotStart {\n    ...FragmentTapBotConfig\n    __typename\n  }\n}"
    }
  ]);
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api-gw-tg.memefi.club/graphql',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `Bearer ${account?.authorization}`, 
      'content-type': 'application/json', 
      'origin': 'https://tg-app.memefi.club', 
      'priority': 'u=1, i', 
      'referer': 'https://tg-app.memefi.club/', 
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    },
    data : data
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
    while (isRun) {
      const response = await callApiClaim(account);
      console.log("callApiClaim", response);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Claim done", response);
        const response = await callApiStartClaim(account);
        isRun = false;
      } 
      else {
        console.log("Job fail", response);
        isRun = false;
      }
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 122 * 1000 * 60);
}

run();
