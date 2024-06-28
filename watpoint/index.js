const axios = require("axios");
const { getDateTimeLocal } = require("../common");

const { accounts } = require("./config");

async function callApiClaim(account) {
  let data = `{"jsonrpc":"2.0","id":"user.authentication.loginUsingTelegram","method":"user.authentication.loginUsingTelegram","params":{"initData":"${account?.authorization}"}}`;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.gamee.com/',
    headers: {
      'accept': '*/*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'authorization': `Bearer ${account?.token}`,
      'client-language': 'en',
      'content-type': 'text/plain;charset=UTF-8',
      'origin': 'https://prizes.gamee.com',
      'priority': 'u=1, i',
      'referer': 'https://prizes.gamee.com/',
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"Android"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
      'x-install-uuid': `${account?.uuid}`,
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

async function callApiLogin(account) {
  let data = `{"jsonrpc":"2.0","id":"user.authentication.loginUsingTelegram","method":"user.authentication.loginUsingTelegram","params":{"initData":"${account?.authorization}"}}`;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.gamee.com/',
    headers: {
      'accept': '*/*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'client-language': 'en',
      'content-type': 'text/plain;charset=UTF-8',
      'origin': 'https://prizes.gamee.com',
      'priority': 'u=1, i',
      'referer': 'https://prizes.gamee.com/',
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'x-install-uuid': `${account?.uuid}`,
      'Cookie': '_nss=1'
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
    const result = await callApiLogin(account);
    console.log("refresh token", result?.result?.tokens?.refresh);
    account.token = result?.result?.tokens?.refresh;

    while (isRun) {
      const response = await callApiClaim(account);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Claim success amount", response);
      } else {
        console.log("Job fail", response);
      }
      isRun = false;
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 122 * 1000 * 60);
}

run();
