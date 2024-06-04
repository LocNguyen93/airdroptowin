const axios = require("axios");
const { accounts } = require("./config");

async function callApi(account) {
  let data = JSON.stringify({
    coins: account?.coins,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.bunnyapp.io/taps",
    headers: {
      accept: "*/*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-type": "application/json",
      cookie: `${account?.cookie}`,
      origin: "https://bunnyapp.io",
      priority: "u=1, i",
      referer: "https://bunnyapp.io/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      "x-client-info": "postgrest-js/1.9.2",
      "x-telegram-user-id": "497430434",
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

async function run() {
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);
    let isRun = true;
    while (isRun) {
      const response = await callApi(account);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Claim success amount", response);
        if (response?.success == false) isRun = false;
      } else {
        console.log("Job fail", response);
        isRun = false;
      }
    }
  }

  console.log("Bunny --> DONE AT ", new Date());
  setTimeout(() => {
    run();
  }, 60 * 1000 * 60);
}

run();
