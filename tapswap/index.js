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

async function extractChq(chq) {
  // const chq =
  //   "fbe8f3fee9f4f2f3bdffb5feb1f9b4e6ebfcefbdf8a0fcb5b4a6eff8e9e8eff3bdffa0fbe8f3fee9f4f2f3b5fbb1fab4e6fba0fbb0ade5fea5a6ebfcefbdf5a0f8c6fbc0a6eff8e9e8eff3bdf5a6e0b1ffb5feb1f9b4a6e0b5fbe8f3fee9f4f2f3b5feb1f9b4e6ebfcefbdf1a0ffb1f8a0feb5b4a6eaf5f4f1f8b5bcbcc6c0b4e6e9efe4e6ebfcefbdfba0edfcefeef8d4f3e9b5f1b5ade5fea5b4b4b2ade5acb6edfcefeef8d4f3e9b5f1b5ade5fea4b4b4b2ade5afb7b5edfcefeef8d4f3e9b5f1b5ade5fefcb4b4b2ade5aeb4b6b0edfcefeef8d4f3e9b5f1b5ade5feffb4b4b2ade5a9b7b5edfcefeef8d4f3e9b5f1b5ade5fefeb4b4b2ade5a8b4b6b0edfcefeef8d4f3e9b5f1b5ade5fef9b4b4b2ade5abb7b5b0edfcefeef8d4f3e9b5f1b5ade5fef8b4b4b2ade5aab4b6b0edfcefeef8d4f3e9b5f1b5ade5fefbb4b4b2ade5a5b7b5edfcefeef8d4f3e9b5f1b5ade5f9adb4b4b2ade5a4b4b6b0edfcefeef8d4f3e9b5f1b5ade5f9acb4b4b2ade5fcb6edfcefeef8d4f3e9b5f1b5ade5f9afb4b4b2ade5ffa6f4fbb5fba0a0a0f9b4ffeff8fcf6a6f8f1eef8bdf8c6baede8eef5bac0b5f8c6baeef5f4fbe9bac0b5b4b4a6e0fefce9fef5b5fab4e6f8c6baede8eef5bac0b5f8c6baeef5f4fbe9bac0b5b4b4a6e0e0e0b5fcb1ade5a8ada9ffadb4b1b5fbe8f3fee9f4f2f3b5b4e6e9efe4e6f8ebfcf1b5baf9f2fee8f0f8f3e9c6c1bafaf8e9d8f1f8f0f8f3e9dfe4d4f9c1bac0a6bab4a6e0fefce9fef5e6eff8e9e8eff3bdade5feadfbf8fffcfff8a6e0ebfcefbdfea0f9f2fee8f0f8f3e9b1f8a0bafaf8e9d8f1f8f0f8f3e9dfe4d4f9bab1fba0bafaf8e9dce9e9eff4ffe8e9f8bab1f5a0fec6f8c0b5bac2fef5efc2bab4a6f5c6baf4f3f3f8efd5c9d0d1bac0a0baa1f9f4eba3a1f9f4ebc1e5afadf4f9a0c1e5afafc2f4c9c2adc1e5afafbab6bac1e5afadc2eba0c1e5afafa8aea9a4adc1e5afafa3a1f9f4ebc1e5afadf4f9a0bab6bac1e5afafc2ccffc2acc1e5afafc1e5afadc2eba0c1e5afafaaadacaca4c1e5afafa3a1bab6baf9f4ebc1e5afadf4f9a0c1e5afafc2e7e5c2afc1e5afafc1e5afadc2eba0c1e5afafa9bab6baaaadaba8c1e5afafa3a1f9f4ebc1e5afadf4f9a0c1e5afafc2fffbc2aebab6bac1e5afafc1e5afadc2eba0c1e5afafa4aeabaaa5c1e5afafa3a1f9f4ebc1e5afadf4f9bab6baa0c1e5afafc2c8e4c2a9c1e5afafc1e5afadc2eba0c1e5afafa5afa9afa4c1e5afafa3bab6baa1b2f9f4eba3a1b2f9f4eba3a1b2f9f4eba3a1b2bab6baf9f4eba3a1b2f9f4eba3a1b2f9f4eba3baa6ebfcefbdf4a0fec6f8c0b5bac2e7e5c2afbab4c6fbc0b5bac2ebbab4b1f7a0fec6f8c0b5bac2f4c9c2adbab4c6fbc0b5bac2ebbab4b1f6a0b6f4a6eff8e9e8eff3bdf6b7a0f6b1f6b7a0b6f7b1f6b8a0ade5a4acf8fbfbb1f6a6e0b5b4b4b4a6fbe8f3fee9f4f2f3bdfcb5b4e6ebfcefbdf0a0c6baacada4ada9a8d5d5d2f3f7fabab1baa5a9ffecc4f6c4f0bab1baaea9aba5aef4cbecd9f0f8bab1baa4affac4cbdffbe5bab1baaaa4abaca8efc9c4fff2c8bab1baaeafa5a4aeafcef2dcdec7eebab1baafacc7fbf3d4eec5bab1baafa4abd5fbd7ccf8f9bab1baaca8afa8a4a8cbcbd9c9f4cdbab1baa9a9afada9adadcfcfc7f1fbf3bab1baacacada8a4a8afacd9f1e7edc9fbbac0a6fca0fbe8f3fee9f4f2f3b5b4e6eff8e9e8eff3bdf0a6e0a6eff8e9e8eff3bdfcb5b4a6e0";
  const len = chq.length,
    bytes = new Uint8Array(len / 2),
    x = 157;
  for (let R = 0; R < len; R += 2) bytes[R / 2] = parseInt(chq.substring(R, R + 2), 16);
  const xored = bytes.map((R) => R ^ x),
    decoded = new TextDecoder().decode(xored);

  const htmlMatch = decoded.match(/innerHTML.+?=(.+?);/is);
  if (!htmlMatch) {
    console.log("err htmlMatch");
  }

  let html = htmlMatch[1].trim().replace(/'\+'/g, "");

  html = eval(html);
  const dom = new JSDOM(html);

  const divElements = dom.window.document.querySelectorAll("div");
  const codes = {};

  divElements.forEach((div) => {
    if (div.hasAttribute("id") && div.hasAttribute("_v")) {
      codes[div.getAttribute("id")] = div.getAttribute("_v");
    }
  });
  console.log(codes);

  const vaMatch = decoded.match(/var\s*i\s*=\s*.+?\(["'](\w+)["']\).+?,/is);
  const vbMatch = decoded.match(/,\s*j\s*=\s*.+?\(["'](\w+)["']\).+?,/is);
  const rMatch = decoded.match(/k\s*%=\s*(\w+)/is);

  if (!vaMatch || !vbMatch || !rMatch) {
    console.log("Error matchh");
  }

  const va = vaMatch[1];
  const vb = vbMatch[1];
  const r = parseInt(rMatch[1], 16);

  const i = parseInt(codes[va]);
  const j = parseInt(codes[vb]);
  let k = i;

  k *= k;
  k *= j;
  k %= r;

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
