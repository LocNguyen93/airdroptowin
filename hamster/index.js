const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApi(account) {
  let data = JSON.stringify({
    "count": 1000,
    "availableTaps": 7996,
    "timestamp": 1717691825
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.hamsterkombatgame.io/clicker/tap',
    headers: { 
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'Connection': 'keep-alive', 
      'Origin': 'https://hamsterkombatgame.io', 
      'Referer': 'https://hamsterkombatgame.io/', 
      'Sec-Fetch-Dest': 'empty', 
      'Sec-Fetch-Mode': 'cors', 
      'Sec-Fetch-Site': 'same-site', 
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', 
      'accept': 'application/json', 
      'authorization': `Bearer ${account?.token}`, 
      'content-type': 'application/json'
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
    while (isRun) {
      const response = await callApi(account);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Claim success amount", response?.clickerUser?.earnPassivePerSec);
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
  }, 15 * 1000 * 60);
}

run();
