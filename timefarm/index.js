const axios = require("axios")
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiLogin(account) {
  let data = JSON.stringify({
    "initData": `${account?.initData}`,
    "platform": "android"
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://tg-bot-tap.laborx.io/api/v1/auth/validate-init/v2',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
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

async function callApiClaim(token) {
  let data = JSON.stringify({});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://tg-bot-tap.laborx.io/api/v1/farming/finish',
  headers: { 
    'accept': '*/*', 
    'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
    'authorization': `Bearer ${token}`, 
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
      'authorization': `Bearer ${token}`, 
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

async function run() {
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);
    let isRun = true;
    let token = "";
    const loginRes = await callApiLogin(account);
    if (loginRes?.statusCode === 201 || loginRes?.statusCode === 200) {
      token = loginRes?.token
      console.log("loginRes", token);
    }
    while (isRun) {
      const claimRes = await callApiClaim(token);
      console.log("Claim", claimRes);
  

      const startRes = await callApiStart(token);
      console.log("Start", startRes);
      isRun = false;
    }
  }
  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 241 * 1000 * 60);
}

run();
