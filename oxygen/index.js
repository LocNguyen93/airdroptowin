const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiClaimBox(account) {
  let data = JSON.stringify({
    "tg": `${account?.tg}`,
    "hash": `${account?.hash}`,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://oxygenminer.online/open_box',
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Cookie': 'AppLoaded=true',
      'Origin': 'https://oxygenminer.online',
      'Referer': `https://oxygenminer.online/?tg_id=${account?.tg}&secret=${account?.hash}`,
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
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
  let data = JSON.stringify({
    "tg": `${account?.tg}`,
    "hash": `${account?.hash}`,
    "referer": `${account?.referer}`,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://oxygenminer.online/login',
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Cookie': 'AppLoaded=true',
      'Origin': 'https://oxygenminer.online',
      'Referer': `https://oxygenminer.online/?tg_id=${account?.tg}&secret=${account?.hash}`,
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
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

async function callApiClaim(account) {
  let data = JSON.stringify({
    "tg": `${account?.tg}`,
    "hash": `${account?.hash}`,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://oxygenminer.online/farm',
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Cookie': 'AppLoaded=true',
      'Origin': 'https://oxygenminer.online',
      'Referer': `https://oxygenminer.online/?tg_id=${account?.tg}&secret=${account?.hash}`,
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
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
    let isClaimBox = true;
    while (isRun) {
      const loginRes = await callApiLogin();
      if (loginRes?.statusCode === 201 || loginRes?.statusCode === 200) {
        console.log("Login");

        // const claimBoxRes = await callApiClaimBox(account);
        // if (isClaimBox && claimBoxRes?.error !== null) {
        //   console.log("Error: You will receive the next Daily box");
        //   isClaimBox = false;
        // } else {
        //   console.log("claimBox", claimBoxRes?.prize);
        // }

        const claimRes = await callApiClaim(account);
        if (claimRes?.statusCode === 201 || claimRes?.statusCode === 200) {
          console.log(claimRes);
          isRun = false;
        } else {
          console.log("Claim fail", claimRes);
          isRun = false;
        }
      }
      else {
        console.log("Login fail");
        isRun = false;
      }
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 122 * 1000 * 60);
}

run();
