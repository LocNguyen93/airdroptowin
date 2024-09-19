const axios = require("axios");

let accounts = [
  {
    index: 6,
    token: "17180269922157iBsu6fHlG8zGjzCaaIHsADWGf3kyQ6oeCvo9B4y1QmkLE5opl3d3RjFEznowLok5263269578",
  },
];

async function callApiUpgradesForBuy(account) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.hamsterkombat.io/clicker/upgrades-for-buy",
    headers: {
      Accept: "*/*",
      "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      Authorization: `Bearer ${account.token}`,
      Connection: "keep-alive",
      "Content-Length": "0",
      Origin: "https://hamsterkombat.io",
      Referer: "https://hamsterkombat.io/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    },
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

async function callApiBuyUpgrade(account, data) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.hamsterkombat.io/clicker/buy-upgrade",
    headers: {
      "Accept-Language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      Connection: "keep-alive",
      Origin: "https://hamsterkombat.io",
      Referer: "https://hamsterkombat.io/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      accept: "application/json",
      authorization: `Bearer ${account.token}`,
      "content-type": "application/json",
    },
    data: data,
  };

  var result = await axios
    .request(config)
    .then((response) => {
      return { statusCode: response?.status, ...response.data };
    })
    .catch(async (error) => {
      return { ...error?.response, statusCode: error?.response?.status };
    });

  return result;
}

function sortUpgradesForBuy(data) {
  return data
    ?.filter((a) => a?.isAvailable && !a?.isExpired && !a?.cooldownSeconds && a?.profitPerHourDelta > 0 && a?.level < 15)
    .sort((a, b) => a.price / a.profitPerHourDelta - b.price / b.profitPerHourDelta);
}
async function run(account) {
  let isRun = true;
  while (isRun) {
    const response = await callApiUpgradesForBuy(account);
    if (response?.statusCode === 201 || response?.statusCode === 200) {
      if (response?.upgradesForBuy && response?.upgradesForBuy?.length > 0) {
        let upgradesForBuy = sortUpgradesForBuy(response?.upgradesForBuy);
        let isNextUpdate = true;
        while (isNextUpdate) {
          const timestamp = new Date().getTime();
          const upgradeId = upgradesForBuy[0]?.id;
          let data = JSON.stringify({
            upgradeId: upgradeId,
            timestamp: timestamp,
          });
          console.log("Update: ", data);
          var responseUpdate = await callApiBuyUpgrade(account, data);

          if (responseUpdate?.statusCode === 201 || responseUpdate?.statusCode === 200) {
            const balanceCoins = responseUpdate?.clickerUser?.balanceCoins
              ? Math.floor(responseUpdate?.clickerUser?.balanceCoins)
              : 0;
            console.log("balanceCoins", balanceCoins);
            console.log("level", upgradesForBuy?.[1]?.level);
            console.log("price", upgradesForBuy?.[1]?.price);
            console.log("profitPerHourDelta", upgradesForBuy?.[1]?.profitPerHourDelta);
            console.log("tb: ", upgradesForBuy?.[1]?.price / upgradesForBuy?.[1]?.profitPerHourDelta);

            if (balanceCoins >= upgradesForBuy?.[1]?.price) {
              if (responseUpdate?.upgradesForBuy && responseUpdate?.upgradesForBuy?.length > 0) {
                upgradesForBuy = sortUpgradesForBuy(responseUpdate?.upgradesForBuy);
              } else {
                isNextUpdate = false;
                console.log("error 01");
              }
            } else {
              console.log("Hết điểm");
              isNextUpdate = false;
            }
          } else {
            isNextUpdate = false;

            console.log("responseUpdate", responseUpdate);
            console.log("Update fail");
          }
        }
      }
      isRun = false;
    } else {
      console.log("Job fail", response);
      isRun = false;
    }
  }

  console.log("DONE AT ", new Date());
  setTimeout(() => {
    run(account);
  }, 60 * 1000 * 60);
}

async function main() {
  for (let index = 0; index < accounts.length; index++) {
    console.log("START ", index);
    let account = accounts[index];
    run(account);
  }
}
main();
