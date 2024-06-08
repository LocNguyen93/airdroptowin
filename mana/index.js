const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiClaim(account) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://wallet-api.spell.club/claim?batch_mode=true',
    headers: { 
      'accept': 'application/json, text/plain, */*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `tma ${account?.authorization}`, 
      'content-length': '0', 
      'origin': 'https://wallet.spell.club', 
      'priority': 'u=1, i', 
      'referer': 'https://wallet.spell.club/', 
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
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
      if (claimRes?.statusCode === 201 || claimRes?.statusCode === 200) {
        console.log("Claim success amount", claimRes);
      } else if (claimRes?.statusCode === 400) {
        console.log("NothingToClaim");
      }
      else {
        console.log("Job fail", claimRes);
      }
      isRun = false;
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 242 * 1000 * 60);
}

run();
