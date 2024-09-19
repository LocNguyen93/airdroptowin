const axios = require("axios");
const puppeteer = require("puppeteer");
const { accounts } = require("./config");
const fs = require("fs");
const vm = require("vm");

const configPath = "./time/config.js";

async function updateConfig(accountIndex, newInitData) {
  // Read the file content
  fs.readFile(configPath, "utf8", (err, fileContent) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Create a script context
    const context = { module: { exports: {} } };
    vm.createContext(context);

    // Evaluate the file content
    vm.runInContext(fileContent, context);

    // Get the accounts array
    let accounts = context.module.exports.accounts;

    accounts = accounts.map((account) => {
      if (account.index === accountIndex) {
        return {
          ...account,
          init_data: newInitData,
        };
      }
      return account;
    });

    // Prepare the updated file content
    const updatedFileContent = `
let accounts = ${JSON.stringify(accounts, null, 2)};

module.exports = { accounts };
`;

    // Write the updated content back to the file
    fs.writeFile(configPath, updatedFileContent, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("File has been updated successfully");
    });
  });
}

async function getDataInit(account, url) {
  const userProfile = account?.userProfile;

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: userProfile,
  });

  const page = await browser.newPage();
  await page.goto(url);
  await new Promise((resolve) => setTimeout(resolve, 8000));
  await page.evaluate(() => {
    const element = document.querySelector("#column-center > div > div > div.bubbles.scrolled-down.has-groups.has-sticky-dates > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div > div > div.reply-markup > div:nth-child(1) > button");
    if (element) {
      element.click();
    }
  });

  // Tạo một Promise để chờ đợi dữ liệu
  let initData = null;

  page.on("response", async (response) => {
      const request = response.request();
      const headers = request.headers();

      if (headers["authorization"]) {
          initData = headers["authorization"];
      }
  });

  // Chờ một chút để đảm bảo rằng tất cả các phản hồi đã được xử lý
  await new Promise((resolve) => setTimeout(resolve, 8000));

  // In ra giá trị của initData
  console.log("initData", initData)

  await new Promise((resolve) => setTimeout(resolve, 8000));
  await page.close();
  await browser.close();

  await updateConfig(account.index, initData);

  return initData;
}
async function callApiClaim(token) {
  let data = JSON.stringify({});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://tg-bot-tap.laborx.io/api/v1/farming/finish',
  headers: { 
    'accept': '*/*', 
    'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
    'authorization': `${token}`, 
    'content-type': 'application/json', 
    'origin': 'https://tg-tap-miniapp.laborx.io', 
    'priority': 'u=1, i', 
    'referer': 'https://tg-tap-miniapp.laborx.io/', 
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

async function callApiStart(token) {
  let data = JSON.stringify({});

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://tg-bot-tap.laborx.io/api/v1/farming/start',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `${token}`, 
      'content-type': 'application/json', 
      'origin': 'https://timefarm.app', 
      'priority': 'u=1, i', 
      'referer': 'https://timefarm.app/', 
      'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'cross-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
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

    const url = "https://web.telegram.org/k/#@TimeFarmCryptoBot";
    const initData = await getDataInit(account, url);

    while (isRun) {
      const claimRes = await callApiClaim(initData);
      console.log("Claim", claimRes);
      const startRes = await callApiStart(initData);
      console.log("Start", startRes);
      isRun = false;
      setTimeout(() => {}, 1000);
    }
  }

  console.log("DONE AT ", new Date());
  setTimeout(() => {
    run();
  }, 180 * 1000 * 60);
}

run();

