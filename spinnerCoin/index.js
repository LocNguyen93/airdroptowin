const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApi(account, tap) {
  let data = JSON.stringify({
    initData: `${account?.initData}`,
    data: {
      clicks: tap,
      isClose: null,
    },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://back.timboo.pro/api/upd-data",
    headers: {
      accept: "*/*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-type": "application/json",
      origin: "https://spinner.timboo.pro",
      priority: "u=1, i",
      referer: "https://spinner.timboo.pro/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
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

async function callApiRepair(account) {
  let data = JSON.stringify({
    initData: `${account?.initData}`,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://back.timboo.pro/api/repair-spinner",
    headers: {
      accept: "*/*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-type": "application/json",
      origin: "https://spinner.timboo.pro",
      priority: "u=1, i",
      referer: "https://spinner.timboo.pro/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
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
async function callApiInitdata(account) {
  let data = JSON.stringify({
    initData: `${account?.initData}`,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://back.timboo.pro/api/init-data",
    headers: {
      authority: "back.timboo.pro",
      accept: "*/*",
      "accept-language": "vi,en;q=0.9,fr-FR;q=0.8,fr;q=0.7,vi-VN;q=0.6,en-US;q=0.5",
      "content-type": "application/json",
      origin: "https://spinner.timboo.pro",
      referer: "https://spinner.timboo.pro/",
      "sec-ch-ua": '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
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
      const resInitdata = await callApiInitdata(account);
      console.log("Initdata", resInitdata?.initData?.spinners);
      if (resInitdata?.statusCode === 201 || resInitdata?.statusCode === 200) {
        const spinners = resInitdata?.initData?.spinners[0];
        const hp = spinners?.hp;
        if (hp === 0 && spinners?.endRepairTime === null) {
          const responseRepair = await callApiRepair(account);
          console.log("Repair", responseRepair);
          isRun = false;
        } else if (hp > 0) {
          const lever = spinners?.spinnerStats?.level;
          const tap = hp / lever;
          const response = await callApi(account, tap);
          if (response?.statusCode === 201 || response?.statusCode === 200) {
            const responseRepair = await callApiRepair(account);
            console.log("Claim success amount", response);
            isRun = false;
          } else {
            console.log("Job fail", response);
            isRun = false;
          }
        } else {
          isRun = false;
        }
      }
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 60 * 1000 * 60);
}

run();
