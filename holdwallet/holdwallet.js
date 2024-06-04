const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiLogin(account) {
  let data = JSON.stringify({
    "walletAddress": `${account?.walletAddress}`,
    "signature": `${account?.signature}`,
    "initData": `${account?.initData}`,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://tg.holdwallet.app/api/auth/login',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'content-type': 'application/json',
      'cookie': '_ga=GA1.1.44874994.1717224762; _ga_MM0C1QLSQK=GS1.1.1717298379.2.1.1717298387.0.0.0',
      'origin': 'https://tg.holdwallet.app',
      'priority': 'u=1, i',
      'referer': 'https://tg.holdwallet.app/login',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
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

async function callApiClaim(accessToken) {
  let data = JSON.stringify({});

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://tg.holdwallet.app/api/user/claim',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'authorization': `Bearer ${accessToken}`,
      'content-type': 'application/json',
      'origin': 'https://tg.holdwallet.app',
      'priority': 'u=1, i',
      'referer': 'https://tg.holdwallet.app/balance',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
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
    const loginRes = await callApiLogin(account);
    let accessToken = ""
    if (loginRes?.statusCode === 200 || loginRes?.statusCode === 201) {
      accessToken = loginRes?.metadata?.accessToken;
    }

    while (isRun) {
      const response = await callApiClaim(accessToken);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log(response?.message);
        isRun = false;
      } else {
        console.log("Job fail", response);
        isRun = false;
      }
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 30 * 1000 * 60);
}

run();
