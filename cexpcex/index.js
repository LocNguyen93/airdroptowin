const axios = require("axios");
//const { handleError } = require("./common");
const { accounts } = require("./config");

const pathApi = {
  getUserInfo: "getUserInfo",
  claimTaps: "claimTaps",
  getChildren: "getChildren",
  claimFromChildren: "claimFromChildren",
  claimFarm: "claimFarm",
  startFarm: "startFarm",
};

async function callApi(pathApi, data) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://cexp.cex.io/api/${pathApi}`,
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      origin: "https://cexp.cex.io",
      priority: "u=1, i",
      referer: "https://cexp.cex.io/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
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

function calculateTimeFarm(isoDateString) {
  const initialDate = new Date(isoDateString);

  // Cộng thêm 4 giờ
  const dateAfter4Hours = new Date(initialDate);
  dateAfter4Hours.setHours(dateAfter4Hours.getHours() + 4);

  const currentDate = new Date();

  // Tính khoảng cách thời gian giữa thời gian hiện tại và thời gian sau 4 giờ
  const differenceInMilliseconds = dateAfter4Hours - currentDate;
  if (differenceInMilliseconds < 0) {
    return 1000;
  }

  return differenceInMilliseconds + 1000;
}

async function run(isRunReFarming = true) {
  let isNextRun = true;
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);

    let requestGetInfo = JSON.stringify({
      devAuthData: account.devAuthData,
      authData: account.authData,
      platform: "android",
      data: {},
    });
    const response = await callApi(pathApi.getUserInfo, requestGetInfo);
    if (response?.statusCode === 201 || response?.statusCode === 200) {
      const { data, status } = response;
      if (status === "ok") {
        // Claim point -------------------
        const availableTaps = data["availableTaps"];
        const balance = data["balance"];
        console.log("balance", balance);

        if (availableTaps > 0) {
          let requestClaimTaps = JSON.stringify({
            devAuthData: account.devAuthData,
            authData: account.authData,
            data: {
              taps: availableTaps,
            },
          });
          const responseClaimTaps = await callApi(pathApi.claimTaps, requestClaimTaps);
          if (responseClaimTaps?.statusCode === 201 || responseClaimTaps?.statusCode === 200) {
            console.log(`CEX-${index} claimTaps successfully!`);
          } else {
            //handleError(`CEX-${index} claimTaps(${responseClaimTaps?.statusCode})`, responseClaimTaps);
          }
        }

        let baseRequest = JSON.stringify({
          devAuthData: account.devAuthData,
          authData: account.authData,
          data: {},
        });

        // Get children
        const responseGetChildren = await callApi(pathApi.getChildren, baseRequest);
        if (responseGetChildren?.statusCode === 201 || responseGetChildren?.statusCode === 200) {
          // Claim from children
          const totalRewardsToClaim = responseGetChildren?.data?.["totalRewardsToClaim"] ?? 0;
          if (totalRewardsToClaim > 0) {
            const responseClaimFromChildren = await callApi(pathApi.claimFromChildren, baseRequest);
            if (responseClaimFromChildren?.statusCode === 201 || responseClaimFromChildren?.statusCode === 200) {
              console.log(`CEX-${index} claimFromChildren successfully!`);
            } else {
              // handleError(
              //   `CEX-${index} claimFromChildren(${responseClaimFromChildren?.statusCode})`,
              //   responseClaimFromChildren,
              // );
            }
          }
        } else {
         // handleError(`CEX-${index} getChildren(${responseGetChildren?.statusCode})`, responseGetChildren);
        }

        // Farm
        if (isRunReFarming) {
          const farmStartedAt = data["farmStartedAt"];
          const timeout = calculateTimeFarm(farmStartedAt);

          async function reFarming() {
            const responseClaimFarm = await callApi(pathApi.claimFarm, baseRequest);
            if (responseClaimFarm?.statusCode === 201 || responseClaimFarm?.statusCode === 200) {
              console.log(`CEX-${index} claimFarm successfully!`);
              const responseStartFarm = await callApi(pathApi.startFarm, baseRequest);
              if (responseStartFarm?.statusCode === 201 || responseStartFarm?.statusCode === 200) {
                console.log(`CEX-${index} startFarm successfully!`);
                const nextTimeFarming = 4 * 60 * 1000 * 60 + 1000 * 10; // 4h + 10s
                setTimeout(async () => {
                  await reFarming();
                }, nextTimeFarming);
              } else {
                //handleError(`CEX-${index} startFarm(${responseStartFarm?.statusCode})`, responseStartFarm);
              }
            } else {
              //handleError(`CEX-${index} claimFarm(${responseClaimFarm?.statusCode})`, responseClaimFarm);
            }
          }

          setTimeout(async () => {
            await reFarming();
          }, timeout);
        }
      } else {
        //handleError(`CEX-${index} getUserInfo(${response?.statusCode})`, response);
        isNextRun = false;
      }
    } else {
      //handleError(`CEX-${index} getUserInfo(${response?.statusCode})`, response);
      isNextRun = false;
    }
  }

  console.log("DONE AT ", new Date());
  if (isNextRun) {
    setTimeout(() => {
      run(false);
    }, 2 * 60 * 1000 * 60);
  }
}

run();
