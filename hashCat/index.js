const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

let updateAccount = accounts;

async function callApiLogin(account) {
  const timestamp = new Date().getTime();
  let data = JSON.stringify({
    dateStartMs: timestamp,
  });
  console.log("data", data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://hashcats-gateway-ffa6af9b026a.herokuapp.com/users/start-tapping",
    headers: {
      accept: "application/json, text/plain, */*",
      Authorization: `tma ${account.queryId}`,
      "accept-language": "vi,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      origin: "https://app.hashcats.net",
      priority: "u=1, i",
      referer: "https://app.hashcats.net/",
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

async function callClaim(queryId, token) {
  let data = JSON.stringify({
    tapBalance: 5000,
    token: token,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://hashcats-gateway-ffa6af9b026a.herokuapp.com/users/save-tap-balance",
    headers: {
      accept: "application/json, text/plain, */*",
      Authorization: `tma ${queryId}`,
      "accept-language": "vi,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      origin: "https://app.hashcats.net",
      priority: "u=1, i",
      referer: "https://app.hashcats.net/",
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
    const resLogin = await callApiLogin(account);
    if (resLogin?.statusCode == 200) {
      let xxx = await callClaim(account?.queryId, resLogin?.token);
      console.log("xxx", xxx);
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 15 * 1000 * 60);
}

run();
