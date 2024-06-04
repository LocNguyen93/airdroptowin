const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiClaim(account) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://wapi.spell.club/claim?batch_mode=true',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'authorization': `tma ${account?.authorization}`,
      'content-length': '0',
      'origin': 'https://wallet.spell.club',
      'priority': 'u=1, i',
      'referer': 'https://wallet.spell.club/',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
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
  }, 241 * 1000 * 60);
}

run();
