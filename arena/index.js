const puppeteer = require('puppeteer');
const {writeFile} = require('../common');
const { paths } = require("./config");

async function getDataInit(path, url) {
  const userProfile = path?.userProfile;

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: userProfile
  });

  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForSelector('#column-center > div > div > div.bubbles.scrolled-down.has-groups.has-sticky-dates > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div > div > div.reply-markup > div:nth-child(1) > button');

  await page.evaluate(() => {
    const element = document.querySelector('#column-center > div > div > div.bubbles.scrolled-down.has-groups.has-sticky-dates > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div > div > div.reply-markup > div:nth-child(1) > button');
    if (element) {
      element.click(); // Click on the button if found
    }
  });
  //await page.waitForSelector('#root > div > div.opacity-100.w-full.text-center.text-white.pt-4.pb-safe-offset-\[72px\].bg-swamp.bg-cover.grid.grid-rows-\[min-content_1fr_min-content_min-content\].overflow-hidden.transition-all.duration-1500 > div.w-full.flex-none > div > button');

  // await page.evaluate(() => {
  //   const element = document.querySelector('body > div.popup.popup-peer.popup-confirmation.active > div > div.popup-buttons > button:nth-child(1)');
  //   if (element) {
  //     element.click(); 
  //   }
  // });

  // await page.evaluate(() => {
  //   const element = document.querySelector('#root > div > div.opacity-100.w-full.text-center.text-white.pt-4.pb-safe-offset-\[72px\].bg-swamp.bg-cover.grid.grid-rows-\[min-content_1fr_min-content_min-content\].overflow-hidden.transition-all.duration-1500 > div.w-full.flex-none > div > button');
  //   if (element) {
  //     element.click(); 
  //   }
  // });

  // let initData = null;
  // page.on('response', async response => {
  //   const request = response.request();
  //   const headers = request.headers();
  //   if (headers['telegram-init-data']) {
  //     initData = headers['telegram-init-data'];
  //   }
  // });

 // await new Promise(resolve => setTimeout(resolve, 30000));
  // await page.close();
  // await browser.close();
  //return initData;
};



async function run() {
  for (let index = 0; index < paths.length; index++) {
    let path = paths[index];
    const url = "https://web.telegram.org/k/#@Arenavsbot";
    console.log("start account --> ", index);
    const initData = await getDataInit(path, url);
   // writeFile("mars", "config.js", index, initData, "initData");
    //await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

run();