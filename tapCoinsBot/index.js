const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

let updateAccount = accounts;

async function callApiLogin(account) {
  let data = JSON.stringify({
    initData: account?.initData,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.tapcoins.app/auth/login",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      origin: "https://game.tapcoins.app",
      priority: "u=1, i",
      referer: "https://game.tapcoins.app/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    },
    data: data,
  };
  var result = await axios
    .request(config)
    .then((response) => {
      return { statusCode: response?.status, ...response.data };
    })
    .catch(async (error) => {
      console.log("Login Fail");
      return { statusCode: error?.response?.status };
    });

  return result;
}

async function callApi(account, power) {
  let data = JSON.stringify({
    coin: 9,
    power: power,
    turbo: 0,
    _token: account?._token,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.tapcoins.app/coin/collect",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      origin: "https://game.tapcoins.app",
      priority: "u=1, i",
      referer: "https://game.tapcoins.app/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    },
    data: data,
  };
  var result = await axios
    .request(config)
    .then((response) => {
      return { statusCode: response?.status, ...response.data };
    })
    .catch(async (error) => {
      console.log("errorClaim");
      return { statusCode: error?.response?.status };
    });

  return result;
}

async function run() {
  for (let index = 0; index < updateAccount.length; index++) {
    let account = updateAccount[index];
    console.log("start account --> ", index);
    let isRun = true;
    let power = 4499;
    while (isRun) {
      const resClaim = await callApi(account, power);
      if (resClaim?.code == 401 && resClaim?.message == "Not logged in") {
        const resLogin = await callApiLogin(account);
        console.log("resLogin", resLogin);
        for (var i in updateAccount) {
          if (updateAccount[i].index == account?.index) {
            updateAccount[i]._token = resLogin?.data?.token;
          }
        }
      } else if (resClaim?.statusCode == 200) {
        power = resClaim?.data?.userInfo?.power;
        if (resClaim?.data?.userInfo?.power < 9) {
          isRun = false;
          console.log(`TapCoinsBot-${index} startTap successfully!`);
        }
      } else {
        isRun = false;
        console.log(`TapCoinsBot-${index} startTap Error!`);
      }
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 15 * 1000 * 60);
}

run();
