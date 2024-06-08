const axios = require("axios")
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiLogin(account) {
  let data = JSON.stringify({
    "init_data": `${account?.initData}`
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api-game.whitechain.io/api/login',
    headers: { 
      'accept': 'application/json', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'content-type': 'application/json', 
      'origin': 'https://rocketf.whitechain.io', 
      'priority': 'u=1, i', 
      'referer': 'https://rocketf.whitechain.io/', 
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
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

async function callApiClickPoint(token, point) {
  let data = JSON.stringify({
    "points": point
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api-game.whitechain.io/api/claim-points',
    headers: { 
      'accept': 'application/json', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `Bearer ${token}`, 
      'cache-control': 'max-age=0', 
      'content-type': 'application/json', 
      'origin': 'https://rocketf.whitechain.io', 
      'priority': 'u=1, i', 
      'referer': 'https://rocketf.whitechain.io/', 
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
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

const boostType = {
  TURBO: "fc5e40ed-c40b-4cfa-9a1a-9a16a5572d84",
  ENERGY: "d212b229-3fb7-4900-a275-5ae0417e0164",
};

async function callApiApplyBoost(token, type) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://api-game.whitechain.io/api/apply-boost/${type}`,
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `Bearer ${token}`, 
      'cache-control': 'max-age=0', 
      'content-length': '0', 
      'origin': 'https://rocketf.whitechain.io', 
      'priority': 'u=1, i', 
      'referer': 'https://rocketf.whitechain.io/', 
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
    let isTurbo = true; //3 time
    let isEnergy= true; //3 time
    let token = "";
    const loginRes = await callApiLogin(account);
    if (loginRes?.statusCode === 201 || loginRes?.statusCode === 200) {
        token = loginRes?.token
    }
    while (isRun) {

      if (isTurbo) {
        const boostTurboRes = await callApiApplyBoost(token, boostType.TURBO);
        if (boostTurboRes?.statusCode === 201 || boostTurboRes?.statusCode === 200) { 
          console.log("ApplyBoostTurbo");
          await callApiClickPoint(token, 500000);
        } else {
          console.log("Error ApplyBoostTurbo", boostTurboRes);
          isTurbo = false;
        }
      }

      if (isEnergy) {
        const boostRes = await callApiApplyBoost(token, boostType.ENERGY);
        if (boostRes?.statusCode === 201 || boostRes?.statusCode === 200) { 
          console.log("ApplyBoostEnergy");
          await callApiClickPoint(token, 10000);
        } else {
          console.log("Error ApplyBoostEnergy", boostRes);
          isTurbo = false;
        }
      }

      const clickPointRes = await callApiClickPoint(token, 1000);
      if (clickPointRes?.statusCode === 201 || clickPointRes?.statusCode === 200) {
        const currentEnergy = clickPointRes?.user?.current_energy;
        console.log("Claim currentEnergy", currentEnergy);
        if (currentEnergy < 10) {
          isRun = false;
        }
      } else {
        console.log("Job fail", clickPointRes);
        isRun = false;
      }
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 5 * 1000 * 60);
}

run();
