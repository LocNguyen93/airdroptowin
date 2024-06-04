const axios = require("axios");
const { getRandomInt } = require("../common");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { accounts } = require("./config");

function calculateContentId(accountId, timestamp) {
  return (accountId * timestamp) % accountId;
}

const pathApi = {
  login: "account/login",
  getPoint: "player/submit_taps",
};

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
      "x-cv": "608",
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
      "x-cv": "608",
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
  //   "b5fbe8f3fee9f4f2f3b5b4bde697e9efe4bde6f8ebfcf1b5bff9f2fee8f0f8f3e9b3faf8e9d8f1f8f0f8f3e9dfe4d4f9bfb4a6e0bdfefce9fef5bde6eff8e9e8eff3bdade5deaddbd8dfdcdfd8a6e097ebfcefbdf9bda0bdf9f2fee8f0f8f3e9a697ebfcefbdfabda0bdbffaf8e9d8f1f8f0f8f3e9dfe4d4f9bfa697ebfcefbdfcbda0bdbffaf8e9dce9e9eff4ffe8e9f8bfa697ebfcefbdefe9bda0bdf9c6fac0b5bfc2fef5efc2bfb4a697efe9c6bff4f3f3f8efbfbdb6bdbfd5c9d0bfbdb6bdbfd1bfc0bda0bdbaa1f9f4eba3a1f9f4ebbdf4f9a0bfc2dccac2adbfbdc2f9c2a0bfaaada5a9a8bfa3a1f9f4ebbdf4f9a0bfc2ecc8c2acbfbdc2f9c2a0bfa8adafaaa5bfa3a1f9f4ebbdf4f9a0bfc2e7eec2afbfbdc2f9c2a0bfaeaaa4aba8bfa3a1f9f4ebbdf4f9a0bfc2ffc7c2aebfbdc2f9c2a0bfa8afafacabbfa3a1f9f4ebbdf4f9a0bfc2e4e4c2a9bfbdc2f9c2a0bfabaaaca4aabfa3a1b2f9f4eba3a1b2f9f4eba3a1b2f9f4eba3a1b2f9f4eba3a1b2f9f4eba3a1b2f9f4eba3baa697ebfcefbdebfcbda0bdf9c6fac0b5bfc2ffc7c2aebfb4c6fcc0b5bfc2f9c2bfb4a6bd97ebfcefbdebffbda0bdf9c6fac0b5bfc2ffc7c2aebfb4c6fcc0b5bfc2f9c2bfb4a697eff8e9e8eff3bdb5b6ebfcbdb7bdb6ebffb4bdb8bdacacaea4acaba697e0b4b5b4a6";
  const chqLength = chq.length;
  let bytesArray = new Uint8Array(chqLength / 2);
  const xorKey = 157;

  for (let i = 0; i < chqLength; i += 2) {
    bytesArray[i / 2] = parseInt(chq.slice(i, i + 2), 16);
  }

  let xorBytes = new Uint8Array(bytesArray.length);
  for (let i = 0; i < bytesArray.length; i++) {
    xorBytes[i] = bytesArray[i] ^ xorKey;
  }

  let decodedXor = new TextDecoder().decode(xorBytes);

  let jsCode = decodedXor
    .split('try {eval("document.getElementById");} catch {return 0xC0FEBABE;}')[1]
    .split("})")[0]
    .trim();

  let html = jsCode.split('rt["inner" + "HTM" + "L"] = ')[1].split("\n")[0];
  let dom = new JSDOM(html);
  let document = dom.window.document;

  let divElements = document.querySelectorAll("div");
  let codes = {};
  divElements.forEach((div) => {
    if (div.hasAttribute("id") && div.hasAttribute("_d_")) {
      codes[div.getAttribute("id")] = div.getAttribute("_d_");
    }
  });

  let va = null;
  let vb = null;
  let jsCodeLines = jsCode.split("\n");
  Object.keys(codes).forEach((key) => {
    if (jsCodeLines[5].includes(key)) {
      va = codes[key];
    }
    if (jsCodeLines[6].includes(key)) {
      vb = codes[key];
    }
  });

  let codeToExecute = jsCode.split("return ")[1].split(";")[0].replace("va", va).replace("vb", vb);

  return eval(codeToExecute);
}

async function callApiApplyBoost(account) {
  let data = JSON.stringify({
    "type": "energy"
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.tapswap.ai/api/player/apply_boost',
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'Authorization': `Bearer ${account?.authorization}`,
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Origin': 'https://app.tapswap.club',
      'Referer': 'https://app.tapswap.club/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'x-app': 'tapswap_server',
      'x-bot': 'no',
      'x-cv': '608'
    },
    data: data
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
          isRun = false;
          // if (isApplyBoot) {
          //   const applyBootRes = await callApiApplyBoost(account);
          //   if (applyBootRes?.statusCode === 400) {
          //     isApplyBoot = false;
          //     isRun = false;
          //   }
          //   console.log("applyBootRes", applyBootRes?.statusCode);
          // }
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
          accounts[index].authorization = access_token;          // if (responseLoginFirst.chq) {
          //   const chr = await extractChq(responseLoginFirst.chq);
          //   const dataLogin = JSON.stringify({
          //     init_data: `${account.init_data}`,
          //     referrer: "",
          //     bot_key: "app_bot_2",
          //     chr: chr,
          //   });
          //   const responseLogin = await callApiLogin(pathApi.login, dataLogin);
          //   const access_token = responseLogin["access_token"];
          //   account.authorization = access_token;
          //   accounts[index].authorization = access_token;
          // }
          // accounts[index].time = responseLogin["player"]["time"] - 1111;
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
