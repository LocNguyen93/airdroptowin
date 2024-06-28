const axios = require("axios");
const { accounts } = require("./config");

const pathApi = {
  me: "me",
  claimClick: "claimClick",
};

async function callApi(pathApi, data) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://bot-game.goonus.io/api/v1/${pathApi}`,
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      origin: "https://onx.goonus.io",
      priority: "u=1, i",
      referer: "https://onx.goonus.io/",
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
      return { ...error?.response?.data, statusCode: error?.response?.status };
    });

  return result;
}

async function run() {
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);

    let requestGetInfo = JSON.stringify({
      initData: account.authData,
      platform: "android",
    });
    const response = await callApi(pathApi.me, requestGetInfo);
    if (response?.statusCode === 200) {
      const { clickNumberLeft } = response;
      if (clickNumberLeft > 0) {
        let requestClaimTaps = JSON.stringify({
          initData: account.authData,
          click: clickNumberLeft,
        });
        const responseClaimTaps = await callApi(pathApi.claimClick, requestClaimTaps);
        if (responseClaimTaps?.statusCode === 201 || responseClaimTaps?.statusCode === 200) {
          console.log(`ONUS-${index} claimClick successfully!`);
        } else {
          console.log(`ONUS-${index} Error!`);
        }
      }
    } else {
      console.log(`ONUS-${index} Error!`);
    }
  }

  console.log("DONE AT ", new Date());
  setTimeout(() => {
    run(false);
  }, 61 * 1000 * 60);
}

run();
