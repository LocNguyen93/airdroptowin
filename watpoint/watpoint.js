const axios = require("axios");
const { accounts } = require("./config");

async function callApi(account) {
  let data = JSON.stringify({
    jsonrpc: "2.0",
    id: "miningEvent.startSession",
    method: "miningEvent.startSession",
    params: {
      miningEventId: 7,
    },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.gamee.com/",
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,vi;q=0.8",
      "content-type": "application/json",
      authorization: `Bearer ${account.authorization}`,
      "client-language": "en",
      origin: "https://prizes.gamee.com",
      priority: "u=1, i",
      referer: "https://prizes.gamee.com/",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Windows",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "x-install-uuid": `${account.uuid}`,
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
