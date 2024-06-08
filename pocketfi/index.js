const axios = require("axios")
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");


async function callApiClaim(account) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://bot.pocketfi.org/mining/claimMining',
    headers: { 
      'Accept': '*/*', 
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'Connection': 'keep-alive', 
      'Content-Length': '0', 
      'Origin': 'https://pocketfi.app', 
      'Referer': 'https://pocketfi.app/', 
      'Sec-Fetch-Dest': 'empty', 
      'Sec-Fetch-Mode': 'cors', 
      'Sec-Fetch-Site': 'cross-site', 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', 
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'telegramRawData': `${account?.initData}`,
    }
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
      const claimRes = await callApiClaim(account);
      console.log("callApiClaim",claimRes);
      isRun = false;
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 60 * 1000 * 60);
}

run();
