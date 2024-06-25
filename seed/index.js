const axios = require("axios");
const puppeteer = require("puppeteer");
const { accounts } = require("./config");
const fs = require("fs");
const vm = require("vm");

const configPath = "./seed/config.js";

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
  await page.waitForSelector(
    "#column-center > div > div > div.bubbles.scrolled-down.has-groups.has-sticky-dates > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div > div > div.reply-markup > div:nth-child(3) > button",
  );

  await page.evaluate(() => {
    const element = document.querySelector(
      "#column-center > div > div > div.bubbles.scrolled-down.has-groups.has-sticky-dates > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div > div > div.reply-markup > div:nth-child(3) > button",
    );
    if (element) {
      element.click();
    }
  });

  let initData = null;
  page.on("response", async (response) => {
    const request = response.request();
    const headers = request.headers();
    if (headers["telegram-data"]) {
      initData = headers["telegram-data"];
      return;
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 8000));
  await page.close();
  await browser.close();

  await updateConfig(account.index, initData);

  return initData;
}

async function callApi(account) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://elb.seeddao.org/api/v1/seed/claim",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-length": "0",
      origin: "https://cf.seeddao.org",
      priority: "u=1, i",
      referer: "https://cf.seeddao.org/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "telegram-data": `${account?.initData}`,
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    },
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

    const url = "https://web.telegram.org/k/#@seed_coin_bot";
    const initData = await getDataInit(account, url);
    account.initData = initData;

    while (isRun) {
      const response = await callApi(account);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Claim success amount", response);
        isRun = false;
      } else if (response?.statusCode === 401) {
        console.log("Re-Login");
        const initData = await getDataInit(account, url);
        account.initData = initData;
      } else {
        console.log("Job fail", response);
        isRun = false;
      }

      setTimeout(() => {}, 1000);
    }
  }

  console.log("DONE AT ", new Date());
  setTimeout(() => {
    run();
  }, 180 * 1000 * 60);
}

run();

