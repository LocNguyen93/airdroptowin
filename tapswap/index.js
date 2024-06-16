const axios = require("axios");
const { getRandomInt } = require("../common");
const puppeteer = require("puppeteer");
const { accounts } = require("./config");

function calculateContentId(accountId, timestamp) {
  return (accountId * timestamp) % accountId;
}

const pathApi = {
  login: "account/login",
  getPoint: "player/submit_taps",
};

const xcv = "627";

async function callApi(pathApi, data, account, timestamp) {
  const contentId = calculateContentId(account.accountId, timestamp);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.tapswap.ai/api/${pathApi}`,
    headers: {
      Accept: "*/*",
      "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      Authorization: `Bearer ${account.authorization}`,
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
      "x-bot": "no",
      "x-cv": `${xcv}`,
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

async function callApiLogin(pathApi, data) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://api.tapswap.ai/api/${pathApi}`,
    headers: {
      Accept: "*/*",
      "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
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
      "x-bot": "no",
      "x-cv": `${xcv}`,
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

async function extractChq(chq) {
  // const chq =
  //   "b5fbe8f3fee9f4f2f3b5feb1f9b4e6ebfcefbdf2a0ffb1f8a0feb5b4a6eaf5f4f1f8b5bcbcc6c0b4e6e9efe4e6ebfcefbdfba0b0edfcefeef8d4f3e9b5f2b5ade5f9f9b4b4b2ade5acb7b5edfcefeef8d4f3e9b5f2b5ade5f9f8b4b4b2ade5afb4b6b0edfcefeef8d4f3e9b5f2b5ade5f9fbb4b4b2ade5aeb6edfcefeef8d4f3e9b5f2b5ade5f8adb4b4b2ade5a9b7b5b0edfcefeef8d4f3e9b5f2b5ade5f8acb4b4b2ade5a8b4b6b0edfcefeef8d4f3e9b5f2b5ade5f8afb4b4b2ade5abb6edfcefeef8d4f3e9b5f2b5ade5f8aeb4b4b2ade5aab7b5edfcefeef8d4f3e9b5f2b5ade5f8a9b4b4b2ade5a5b4b6b0edfcefeef8d4f3e9b5f2b5ade5f8a8b4b4b2ade5a4b6edfcefeef8d4f3e9b5f2b5ade5f8abb4b4b2ade5fcb7b5edfcefeef8d4f3e9b5f2b5ade5f8aab4b4b2ade5ffb4a6f4fbb5fba0a0a0f9b4ffeff8fcf6a6f8f1eef8bdf8c6baede8eef5bac0b5f8c6baeef5f4fbe9bac0b5b4b4a6e0fefce9fef5b5fab4e6f8c6baede8eef5bac0b5f8c6baeef5f4fbe9bac0b5b4b4a6e0e0e0b5fcb1ade5a4aaffafa8b4b1b5fbe8f3fee9f4f2f3b5b4e6ebfcefbdf8a0e6e0a6f8c6baf6eeeee4d5bac0a0bafaf8e9d8f1f8f0f8f3e9dfe4d4f9bab1f8c6baedd6eff1febac0a0bafaf8e9dce9e9eff4ffe8e9f8bab1f8c6baf3d2d6f1c5bac0a0bac2fef5efc2bab1f8c6bad9cbcbf8d4bac0a0baf4f3f3f8efd5c9d0d1bab1f8c6baeefbd7c5ffbac0a0baa1f9f4eba3a1f9f4ebc1e5afadf4f9a0c1e5afafc2d7acc2adc1e5afafbab6bac1e5afadc2eba0c1e5afafa8a4a4aca9c1e5afafa3a1f9f4ebc1e5afadf4f9a0bab6bac1e5afafc2d5a8c2acc1e5afafc1e5afadc2eba0c1e5afafa8aba9adacc1e5afafa3a1bab6baf9f4ebc1e5afadf4f9a0c1e5afafc2f4f6c2afc1e5afafc1e5afadc2eba0c1e5afafafbab6baa8aea8afc1e5afafa3a1f9f4ebc1e5afadf4f9a0c1e5afafc2d2f4c2aebab6bac1e5afafc1e5afadc2eba0c1e5afafa9a8afaba4c1e5afafa3a1f9f4ebc1e5afadf4f9bab6baa0c1e5afafc2fad2c2a9c1e5afafc1e5afadc2eba0c1e5afafa9a9afaaabc1e5afafa3bab6baa1b2f9f4eba3a1b2f9f4eba3a1b2f9f4eba3a1b2bab6baf9f4eba3a1b2f9f4eba3a1b2f9f4eba3bab1f8c6bacdccc7f0d0bac0a0bac2f4f6c2afbaa6ebfcefbdfba0f8a6e9efe4e6f8ebfcf1b5baf9f2fee8f0f8f3e9c6c1bafaf8e9d8f1f8f0f8f3e9dfe4d4f9c1bac0a6bab4a6e0fefce9fef5e6eff8e9e8eff3bdade5feadfbf8fffcfff8a6e0ebfcefbdf5a0f9f2fee8f0f8f3e9b1f4a0fbc6baf6eeeee4d5bac0b1f7a0fbc6baedd6eff1febac0b1f6a0f5c6f4c0b5fbc6baf3d2d6f1c5bac0b4a6f6c6fbc6bad9cbcbf8d4bac0c0a0fbc6baeefbd7c5ffbac0a6ebfcefbdf1a0f5c6f4c0b5fbc6bacdccc7f0d0bac0b4c6f7c0b5bac2ebbab4b1f0a0f5c6f4c0b5bac2d5a8c2acbab4c6f7c0b5bac2ebbab4b1f3a0b6f1a6eff8e9e8eff3bdf3b7a0f3b1f3b7a0b6f0b1f3b8a0ade5aeaaf9fea4b1f3a6e0b5b4b4b4a6fbe8f3fee9f4f2f3bdffb5feb1f9b4e6ebfcefbdf8a0fcb5b4a6eff8e9e8eff3bdffa0fbe8f3fee9f4f2f3b5fbb1fab4e6fba0fbb0ade5f9f9a6ebfcefbdf5a0f8c6fbc0a6eff8e9e8eff3bdf5a6e0b1ffb5feb1f9b4a6e0fbe8f3fee9f4f2f3bdfcb5b4e6ebfcefbdeda0c6baaff5f8c9f3fafcbab1baafaaabababa8aad6d7f6cafbe8bab1baa9f6d8edcfd1ccbab1baa9ababaeaca8cfdff8e4ecd4bab1baaea4a5a4a5a5adfaeeede9ced0bab1baacafadafa4a8d5d8c7dee9f4bab1baa8afa5ebd7d7e5fce8bab1baa5a9adaba9a9acd7fac9ceccdabab1baaaadd9f1cedcd5cbbab1baaeaea8acafafaaebcbcffcf8d0bab1baaeada4a9a4e4ead8d0d5f8bac0a6fca0fbe8f3fee9f4f2f3b5b4e6eff8e9e8eff3bdeda6e0a6eff8e9e8eff3bdfcb5b4a6e0";
  let browser;
  let page;
  const xorKey = 157;
  if (!browser) {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  }

  const chqLength = chq.length;

  let bytesArray = new Uint8Array(chqLength / 2);

  for (let i = 0; i < chqLength; i += 2) {
    bytesArray[i / 2] = parseInt(chq.substring(i, i + 2), 16);
  }

  let xorBytes = bytesArray.map((b) => b ^ xorKey);
  let decodedXor = Buffer.from(xorBytes).toString("utf8");

  await page.evaluate(() => {
    var chrStub = document.createElement("div");
    chrStub.id = "_chr_";
    document.body.appendChild(chrStub);
  });

  let fixedXor = decodedXor.replace(/`/g, "\\`");

  let k = await page.evaluate((fixedXor) => {
    try {
      console.log(eval(fixedXor));
      return eval(fixedXor);
    } catch (e) {
      return e.toString();
    }
  }, fixedXor);
  console.log(k); // 176310

  return k;
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
            const chr = await extractChq(responseLoginFirst.chq);
            const dataLogin = JSON.stringify({
              init_data: `${account.init_data}`,
              referrer: "",
              bot_key: "app_bot_2",
              chr: chr,
            });
            const responseLogin = await callApiLogin(pathApi.login, dataLogin);
            const access_token = responseLogin["access_token"];
            account.authorization = access_token;
            accounts[index].authorization = access_token;
            // accounts[index].time = responseLogin["player"]["time"] - 1111;
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
