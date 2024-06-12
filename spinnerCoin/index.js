const axios = require("axios");
const { getDateTimeLocal, handleError, sleep, countdown } = require("../common");
const { accounts } = require("./config");

async function callApiClaim(account) {
  let data = JSON.stringify({
    initData: `${account?.initData}`,
    data: {
      clicks: 10,
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

async function repairSpinner(account) {
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

async function openBox(account) {
  let data = JSON.stringify({
    initData: `${account?.initData}`,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://back.timboo.pro/api/open_box",
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

async function getInitData(account) {
  let data = JSON.stringify({
    initData: `${account?.initData}`,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://back.timboo.pro/api/init-data",
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

async function funcRepairSpinner(account) {
  const _repairSpinner = await repairSpinner(account);
  if (_repairSpinner?.statusCode === 201 || _repairSpinner?.statusCode === 200) {
    console.log("repairSpinner successful");
  } else {
    handleError(`SpinnerCoin-${account.index} repairSpinner(${_repairSpinner?.statusCode})`, _repairSpinner);
  }
}

function calculateTimeClaim(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const delta = target - now;
  return delta + 2000;
}

async function run(account) {
  const _getInitData = await getInitData(account);
  if (_getInitData?.statusCode === 201 || _getInitData?.statusCode === 200) {
    console.log("getInitData successful");
    // case có 1 spinner
    const spinner = _getInitData?.initData?.spinners?.[0];
    if (spinner?.endRepairTime == null) {
      if (spinner?.hp > 0) {
        // Có điểm mà đang không countdown thì claim
        let isClaim = true;
        while (isClaim) {
          const _claim = await callApiClaim(account);
          if (_claim?.statusCode === 201 || _claim?.statusCode === 200) {
            console.log("Claim successful");
            await countdown(4);
          } else if (_claim?.statusCode === 400) {
            //400 tức là hết điểm
            funcRepairSpinner(account);
            isClaim = false;
          } else {
            handleError(`SpinnerCoin-${account.index} callApiClaim(${_claim?.statusCode})`, _claim);
            isClaim = false;
          }
        }
      } else {
        funcRepairSpinner(account);
      }

      // 1h call lại
      setTimeout(() => {
        run(account);
      }, 60 * 60 * 1000);
    } else {
      const timeout = calculateTimeClaim(spinner?.endRepairTime);
      setTimeout(() => {
        run(account);
      }, timeout);
    }
  } else {
    handleError(`SpinnerCoin-${account.index} getInitData(${_getInitData?.statusCode})`, _getInitData);

    // 1h call lại
    setTimeout(() => {
      run(account);
    }, 60 * 60 * 1000);
  }
}

async function main() {
  for (let index = 0; index < accounts.length; index++) {
    console.log("START ", index);
    let account = accounts[index];
    run(account);
  }
}

main();
