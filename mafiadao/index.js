const axios = require("axios");
const { countdown, getRandomInt, getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiLogin(account) {
  let data = JSON.stringify({
    sid: account?.sid,
    onLoginActionArgs: {
      isPremium: true,
    },
    id: account?.id,
    auth: account?.auth,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://telegram-tycoon.us-east-1.replicant.gc-internal.net/telegram-tycoon/v1.25.1/loginOrCreate",
    headers: {
      accept: "*/*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-profile": "public",
      "content-type": "application/json",
      origin: "https://telegram-tycoon.cdn.gc-internal.net",
      priority: "u=1, i",
      referer: "https://telegram-tycoon.cdn.gc-internal.net/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      "x-client-info": "postgrest-js/1.9.2",
    },
    data: data,
  };

  var result = await axios
    .request(config)
    .then((response) => {
      return { statusCode: response?.status, ...response.data };
    })
    .catch(async (error) => {
      console.log("errorLogin");
      return { statusCode: error?.response?.status };
    });

  return result;
}

async function callApiClaim(account, rev, token, abTestsDynamicConfig, lastClientRequestId) {
  let data = JSON.stringify({
    abTestsDynamicConfig: abTestsDynamicConfig,
    auth: token,
    clientRandomSeed: 0,
    consistentFetchIds: [],
    crqid: lastClientRequestId,
    id: account?.id,
    queue: [
      {
        async: false,
        fn: "tap",
        meta: { now: new Date().getTime() },
        times: 1500,
      },
    ],
    requestedProfileIds: [],
    rev: rev,
    sid: account?.sid,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://telegram-tycoon.us-east-1.replicant.gc-internal.net/telegram-tycoon/v1.25.1/replicate",
    headers: {
      accept: "*/*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-profile": "public",
      "content-type": "application/json",
      origin: "https://telegram-tycoon.cdn.gc-internal.net",
      priority: "u=1, i",
      referer: "https://telegram-tycoon.cdn.gc-internal.net/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      "x-client-info": "postgrest-js/1.9.2",
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
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);
    const resLogin = await callApiLogin(account);
    if (resLogin?.statusCode === 201 || resLogin?.statusCode === 200) {
      const { rev, token, abTestsDynamicConfig, metainfo } = resLogin?.data;
      const { lastClientRequestId } = metainfo;
      const responseClaim = await callApiClaim(account, rev, token, abTestsDynamicConfig, lastClientRequestId);
      if (responseClaim?.statusCode === 201 || responseClaim?.statusCode === 200) {
        console.log(`Claim account ${index} successfully`);
      } else {
        console.log(`Claim account ${index} Error`);
      }
    } else {
      return;
    }
    // const response = await callApiClaim(account);
    // if (response?.statusCode === 201 || response?.statusCode === 200) {
    //   console.log("Claim success amount", response);
    // } else {
    //   console.log("Job fail", response);
    // }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 15 * 1000 * 60);
}

run();
