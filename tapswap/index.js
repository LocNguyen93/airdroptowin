const axios = require("axios");
const { getRandomInt } = require("../common");
const puppeteer = require("puppeteer");
const { accounts } = require("./config");

function calculateContentId(accountId, timestamp) {
  return (accountId * timestamp) % accountId;
}

const defaultChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function makeRandomString(length) {
  let randomString = "";
  const charsLength = defaultChars.length;

  for (let i = 0; i < length; i++) {
    randomString += defaultChars.charAt(Math.floor(Math.random() * charsLength));
  }
  return randomString;
}

const decodedCacheId = (jsCode, length = 8) => {
  const pattern = new RegExp("\\b\\w{" + length + "}\\b", "g");
  const matches = jsCode.match(pattern);
  const trashWords = new Set(["function", "continue", "document", "parseInt", "toString"]);
  const filteredMatches = matches.filter(
    (match) => match.match(/^\w+$/) && !trashWords.has(match) && !match.startsWith("x22"),
  );
  const uniqueFilteredMatches = Array.from(new Set(filteredMatches));
  return uniqueFilteredMatches.join(" ");
};

const pathApi = {
  login: "account/login",
  getPoint: "player/submit_taps",
};

const xcv = "631";

async function callApi(pathApi, data, account, timestamp) {
  const contentId = calculateContentId(account.accountId, timestamp);
  const cacheId = account.cacheId;

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.tapswap.ai/api/${pathApi}`,
    headers: {
      Accept: "*/*",
      "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      Authorization: `Bearer ${account.authorization}`,
      "Cache-Id": `${cacheId}`,
      Connection: "keep-alive",
      "Content-Id": `${contentId}`,
      "Content-Type": "application/json",
      Origin: "https://app.tapswap.club",
      Referer: "https://app.tapswap.club/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "x-app": "tapswap_server",
      "x-cv": `${xcv}`,
      "x-touch": "1",
    },
    data: data,
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

async function callApiLogin(pathApi, data, cacheId = makeRandomString(8)) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.tapswap.ai/api/${pathApi}`,
    headers: {
      Accept: "*/*",
      "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "Cache-Id": `${cacheId}`,
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Origin: "https://app.tapswap.club",
      Referer: "https://app.tapswap.club/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "x-app": "tapswap_server",
      "x-cv": `${xcv}`,
      "x-touch": "1",
    },
    data: data,
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

async function extractChq(chq, accountId) {
  if (typeof global.browser === "undefined" || global.browser === null) {
    global.browser = await puppeteer.launch({ headless: true });
    global.page = await global.browser.newPage();
  }

  const chqLength = chq.length;

  let bytesArray = Buffer.alloc(chqLength / 2);
  const xorKey = 157;

  for (let i = 0; i < chqLength; i += 2) {
    bytesArray[i / 2] = parseInt(chq.substring(i, i + 2), 16);
  }

  let xorBytes = Buffer.alloc(bytesArray.length);
  for (let i = 0; i < bytesArray.length; i++) {
    xorBytes[i] = bytesArray[i] ^ xorKey;
  }

  const decodedXor = xorBytes.toString("utf-8");

  await global.page.evaluate(() => {
    window.ctx = {};
    window.ctx.api = {};
    window.ctx.d_headers = new Map();
    window.ctx.api.setHeaders = function (entries) {
      for (const [W, U] of Object.entries(entries)) window.ctx.d_headers.set(W, U);
    };
    var chrStub = document.createElement("div");
    chrStub.id = "_chr_";
    document.body.appendChild(chrStub);
  });

  const fixedXor = decodedXor.replace(/`/g, "\\`");

  let chr = await global.page.evaluate((fixedXor) => {
    try {
      return eval(fixedXor);
    } catch (e) {
      return e;
    }
  }, fixedXor);

  const cacheId = await global.page.evaluate(() => {
    try {
      return window.ctx.d_headers.get("Cache-Id");
    } catch (e) {
      return e;
    }
  });
  console.log("Decoded Login Pass", cacheId, chr);
  const keyPass = accountId % (10000 + parseInt(xcv));
  chr = chr + keyPass;
  return { chr, cacheId };
}

async function callApiApplyBoost(account) {
  let data = JSON.stringify({
    type: "energy",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.tapswap.ai/api/player/apply_boost",
    headers: {
      Accept: "*/*",
      "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      Authorization: `Bearer ${account?.authorization}`,
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Origin: "https://app.tapswap.club",
      Referer: "https://app.tapswap.club/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      "x-app": "tapswap_server",
      "x-bot": "no",
      "x-cv": "621",
    },
    data: data,
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
    let isApplyBoot = true;
    while (isRun) {
      const randomNum = getRandomInt(10, 15);
      const timestamp = new Date().getTime();
      let dataGetPoint = JSON.stringify({
        taps: randomNum,
        time: timestamp,
      });

      const response = await callApi(pathApi.getPoint, dataGetPoint, account, timestamp);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        const data = response;
        const energy = data["player"]["energy"];
        const shares = data["player"]["shares"];
        console.log("energy ", energy);
        console.log("shares ", shares);

        if (energy < 100) {
          //isRun = false;
          if (isApplyBoot) {
            const applyBootRes = await callApiApplyBoost(account);
            if (applyBootRes?.statusCode === 400) {
              isApplyBoot = false;
              isRun = false;
            }
            console.log("applyBootRes", applyBootRes?.statusCode);
          }
        }
      } else if (response?.statusCode === 401 || response?.statusCode === 400) {
        const dataLoginFirst = JSON.stringify({
          init_data: `${account.init_data}`,
          referrer: "",
          bot_key: "app_bot_2",
        });
        const responseLoginFirst = await callApiLogin(pathApi.login, dataLoginFirst);

        if (responseLoginFirst?.statusCode === 201 || responseLoginFirst?.statusCode === 200) {
          const access_token = responseLoginFirst["access_token"];
          account.authorization = access_token;
          accounts[index].authorization = access_token;
          if (responseLoginFirst.chq) {
            const extract_Chq = await extractChq(responseLoginFirst.chq, account?.accountId);
            const dataLogin = JSON.stringify({
              init_data: `${account.init_data}`,
              referrer: "",
              bot_key: "app_bot_2",
              chr: extract_Chq.chr,
            });
            const responseLogin = await callApiLogin(pathApi.login, dataLogin, extract_Chq.cacheId);
            if (responseLogin?.statusCode === 201 || responseLogin?.statusCode === 200) {
              const access_token = responseLogin["access_token"];
              account.authorization = access_token;
              account.cacheId = extractChq.cacheId;
              accounts[index].authorization = access_token;
              // accounts[index].time = responseLogin["player"]["time"] - 1111;
            } else {
              console.log("Login fail");
              isRun = false;
            }
          }
        } else {
          console.log("Login fail");
        }
      }
    }
  }

  console.log("DONE AT ", new Date());
  setTimeout(() => {
    run();
  }, 5 * 1000 * 60);
}

run();
