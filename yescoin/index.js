const axios = require("axios");
const { getDateTimeLocal } = require("../common");

const { accounts } = require("./config");
async function callApiClaim(account) {
  let data = JSON.stringify(1500);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.yescoin.gold/game/collectCoin",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-type": "application/json",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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

async function callApiRecoverCoinPool(account) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.yescoin.gold/game/recoverCoinPool",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-length": "0",
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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
    while (isRun) {
      const response = await callApiClaim(account);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        if (response?.code === 400003) {
          console.log(response?.message);

          const recoverCoinPoolResult = await callApiRecoverCoinPool(account);
          console.log("RecoverCoinPool");
          if (recoverCoinPoolResult?.code === 400007) {
            console.log("End RecoverCoinPool", recoverCoinPoolResult?.statusCode);
            isRun = false;
          }
        } else {
          console.log("Claim success amount", response?.data);
        }
      } else {
        console.log("Job fail", response);
        isRun = false;
      }
    }

    console.log("DONE AT ", getDateTimeLocal());
    setTimeout(() => {
      run();
    }, 21 * 1000 * 60);
  }
}

run();
