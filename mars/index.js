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
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://zavod-api.mdaowallet.com/user/claim',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'content-length': '0',
      'origin': 'https://zavod.mdaowallet.com',
      'priority': 'u=1, i',
      'referer': 'https://zavod.mdaowallet.com/',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'telegram-init-data': `${account?.initData}`,
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
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
      } else if (response?.statusCode === 400) {
        console.log("Re-login");
        const url = "https://web.telegram.org/k/#@Mdaowalletbot";
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
      writeFile("mars", "config.js", index, initData, "initData");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 122 * 1000 * 60);
}

run();
