const axios = require("axios");
const { countdown, getRandomInt, getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiClaim(account) {
  //const _coins = getRandomInt(19980, 20000);
  let data = JSON.stringify({
    coins: 20000,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://jjvnmoyncmcewnuykyid.supabase.co/rest/v1/rpc/save_coins",
    headers: {
      accept: "*/*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      apikey: `${account?.apikey}`,
      authorization: `Bearer ${account?.authorization}`,
      "content-profile": "public",
      "content-type": "application/json",
      origin: "https://dot.dapplab.xyz",
      priority: "u=1, i",
      referer: "https://dot.dapplab.xyz/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      "x-client-info": "postgrest-js/1.9.2",
      "x-telegram-user-id": `${account?.userId}`,
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

async function callApiClaimDaily(account) {
  let data = JSON.stringify({
    "coins": 150000
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://jjvnmoyncmcewnuykyid.supabase.co/rest/v1/rpc/try_your_luck',
    headers: {
      'accept': '*/*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'apikey': `${account?.apikey}`,
      'authorization': `Bearer ${account?.authorization}`,
      'content-profile': 'public',
      'content-type': 'application/json',
      'origin': 'https://dot.dapplab.xyz',
      'priority': 'u=1, i',
      'referer': 'https://dot.dapplab.xyz/',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'x-client-info': 'postgrest-js/1.9.2',
      'x-telegram-user-id': `${account?.userId}`,
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
    let isClaimDaily = true;


    while (isRun) {
      // const claimDailyRes = await callApiClaimDaily(accounts);
      // console.log("callApiClaimDaily", claimDailyRes);
      // if (isClaimDaily && (claimDailyRes?.statusCode === 201 || claimDailyRes?.statusCode === 200)) {
      //   console.log("callApiClaimDaily", claimDailyRes);
      //   isClaimDaily = false;
      // }

      const response = await callApiClaim(account);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Claim success amount", response);
        if (response?.success == false) {
          isRun = false;
        } else {
          const time = getRandomInt(15, 20);
          await countdown(time);
        }
      } else {
        console.log("Job fail", response);
        isRun = false;
      }
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 120 * 1000 * 60);
}

run();
