const axios = require("axios");
const { getDateTimeLocal, getRandomInt, handleError, countdown } = require("../common");
let { accounts } = require("./config");

async function callApiClaim(account) {
  const quantity = getRandomInt(140, 150);
  let data = JSON.stringify(quantity);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api-backend.yescoin.gold/game/collectCoin",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-type": "application/json",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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

async function collectCoin(account, quantity) {
  let data = JSON.stringify(quantity);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api-backend.yescoin.gold/game/collectCoin",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-type": "application/json",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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

//Get full Coin Pool
async function recoverCoinPool(account) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api-backend.yescoin.gold/game/recoverCoinPool",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-length": "0",
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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

//Get my box
async function recoverSpecialBox(account) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api-backend.yescoin.gold/game/recoverSpecialBox",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-length": "0",
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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

//Get random box
async function getSpecialBoxInfo(account) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://api-backend.yescoin.gold/game/getSpecialBoxInfo",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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

async function getAccountBuildInfo(account) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://api-backend.yescoin.gold/build/getAccountBuildInfo",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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

async function getGameInfo(account) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://api-backend.yescoin.gold/game/getGameInfo",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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

const BoxType = {
  randomBox: 1,
  myBox: 2,
};

async function collectSpecialBoxCoin(account, boxType) {
  let data = JSON.stringify({
    boxType: boxType,
    coinCount: 198, // maximum is 200
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api-backend.yescoin.gold/game/collectSpecialBoxCoin",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      origin: "https://www.yescoin.gold",
      priority: "u=1, i",
      referer: "https://www.yescoin.gold/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      token: `${account?.token}`,
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
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

async function getCoinPoolLeftCount(account) {
  const _getGameInfo = await getGameInfo(account);
  if (_getGameInfo?.statusCode === 201 || _getGameInfo?.statusCode === 200) {
    if (_getGameInfo?.code === 0) {
      return _getGameInfo?.data?.coinPoolLeftCount ?? 0; // Số point đang có
    } else {
      console.log("ERROR: getCoinPoolLeftCount");
      return 0;
    }
  }
}

async function collectAll(account) {
  const _getAccountBuildInfo = await getAccountBuildInfo(account);
  if (_getAccountBuildInfo?.statusCode === 201 || _getAccountBuildInfo?.statusCode === 200) {
    const { code, data } = _getAccountBuildInfo;
    if (code === 0) {
      account.singleCoinValue = data?.singleCoinValue; // 1 click = ??? point
      account.coinPoolRecoverySpeed = data?.coinPoolRecoverySpeed; // 1s get ??? point
      account.coinPoolLeftRecoveryCount = data?.coinPoolLeftRecoveryCount; // quantity boots full coin
      account.specialBoxLeftRecoveryCount = data?.specialBoxLeftRecoveryCount; // quantity my box
      account.coinPoolTotalCount = data?.coinPoolTotalCount; // max point in pool
    } else {
      return { isSuccess: false, response: _getAccountBuildInfo };
    }
  } else {
    return { isSuccess: false, response: _getAccountBuildInfo };
  }

  const _getGameInfo = await getGameInfo(account);
  if (_getGameInfo?.statusCode === 201 || _getGameInfo?.statusCode === 200) {
    const { code, data } = _getGameInfo;
    if (code === 0) {
      let coinPoolLeftCount = data?.coinPoolLeftCount ?? 0; // Số point đang có
      let isRun = true;
      while (isRun) {
        if (coinPoolLeftCount > 100) {
          while (coinPoolLeftCount > 100) {
            const maxQuantity = Math.floor(coinPoolLeftCount / account.singleCoinValue);
            let randomQuantity = getRandomInt(140, 150);
            let quantity = maxQuantity < randomQuantity ? maxQuantity : randomQuantity;
            const _collectCoin = await collectCoin(account, quantity);
            if (_collectCoin?.statusCode === 201 || _collectCoin?.statusCode === 200) {
              const { code, data } = _collectCoin;
              if (code === 0) {
                coinPoolLeftCount = coinPoolLeftCount - data?.collectAmount;
                if (coinPoolLeftCount < 100) {
                  break;
                }
                coinPoolLeftCount += account.coinPoolRecoverySpeed * 8;
              } else {
                break;
              }
              await countdown(8);
            }
          }
        } else if (account.specialBoxLeftRecoveryCount > 0) {
          //claim my box
          while (account.specialBoxLeftRecoveryCount > 0) {
            const _recoverSpecialBox = await recoverSpecialBox(account);
            if (_recoverSpecialBox?.statusCode === 201 || _recoverSpecialBox?.statusCode === 200) {
              if (_recoverSpecialBox?.code === 0) {
                const _getSpecialBoxInfo = await getSpecialBoxInfo(account);
                if (_getSpecialBoxInfo?.statusCode === 201 || _getSpecialBoxInfo?.statusCode === 200) {
                  console.log("_getSpecialBoxInfo", _getSpecialBoxInfo);
                  const recoveryBox = _getSpecialBoxInfo?.data?.recoveryBox;
                  console.log("recoveryBox", recoveryBox);
                  if (recoveryBox && recoveryBox !== null) {
                    account.specialBoxLeftRecoveryCount = account.specialBoxLeftRecoveryCount - 1;
                    await countdown(15);
                    const _collectSpecialBoxCoin = await collectSpecialBoxCoin(account, BoxType.myBox);
                    if (_collectSpecialBoxCoin?.statusCode === 201 || _collectSpecialBoxCoin?.statusCode === 200) {
                      console.log("Claim my box successful", _collectSpecialBoxCoin);
                    } else {
                      console.log("Claim my box fail", _collectSpecialBoxCoin);
                      handleError(
                        `YesCoin-${account.index} Claim my box(${_collectSpecialBoxCoin?.statusCode})`,
                        _collectSpecialBoxCoin,
                      );
                    }
                  }
                }
              } else {
                console.log("_recoverSpecialBox000000000000", _recoverSpecialBox);
              }
            } else {
              handleError(`YesCoin-${account.index} Get my box(${_recoverSpecialBox?.statusCode})`, _recoverSpecialBox);
            }
          }
          coinPoolLeftCount = await getCoinPoolLeftCount(account);
          account.specialBoxLeftRecoveryCount = 0;
        } else if (account.coinPoolLeftRecoveryCount > 0) {
          coinPoolLeftCount = await getCoinPoolLeftCount(account);
          if (coinPoolLeftCount < 100) {
            const _recoverCoinPool = await recoverCoinPool(account);
            if (_recoverCoinPool?.statusCode === 201 || _recoverCoinPool?.statusCode === 200) {
              if (_recoverCoinPool?.code === 0) {
                console.log("_recoverCoinPool");
                coinPoolLeftCount = account.coinPoolTotalCount;
                account.coinPoolLeftRecoveryCount = account.coinPoolLeftRecoveryCount - 1;
              } else {
                console.log("ERROR: recoverCoinPool");
              }
            }
          }
        } else {
          isRun = false;
        }
      }
    } else {
      return { isSuccess: false, response: _getGameInfo };
    }
  } else {
    return { isSuccess: false, response: _getGameInfo };
  }
  return { isSuccess: true };
}

async function run(account, isFirst = true) {
  await countdown(account.index ?? 0 + 1);
  // Only first start project
  if (isFirst) {
    const _collectAll = await collectAll(account);
    if (!_collectAll?.isSuccess) {
      handleError("ERROR collectAll", _collectAll);
    }

    async function funcGetSpecialBoxInfo() {
      //Get random box then claim
      const _getSpecialBoxInfo = await getSpecialBoxInfo(account);
      if (_getSpecialBoxInfo?.statusCode === 201 || _getSpecialBoxInfo?.statusCode === 200) {
        console.log("_getSpecialBoxInfo", _getSpecialBoxInfo);
        const autoBox = _getSpecialBoxInfo?.data?.autoBox;
        if (autoBox && autoBox !== null) {
          await countdown(15);
          const _collectSpecialBoxCoin = await collectSpecialBoxCoin(account, BoxType.randomBox);
          if (_collectSpecialBoxCoin?.statusCode === 201 || _collectSpecialBoxCoin?.statusCode === 200) {
            console.log("Claim random box successful", _collectSpecialBoxCoin);
          } else {
            console.log("Claim random box fail", _collectSpecialBoxCoin);
            handleError(
              `YesCoin-${account.index} Claim random box(${_collectSpecialBoxCoin?.statusCode})`,
              _collectSpecialBoxCoin,
            );
          }
        }
      } else {
        handleError(`YesCoin-${account.index} Get random box(${_getSpecialBoxInfo?.statusCode})`, _getSpecialBoxInfo);
      }

      setTimeout(async () => {
        await funcGetSpecialBoxInfo();
      }, 30 * 60 * 1000);
    }

    setTimeout(async () => {
      await funcGetSpecialBoxInfo();
    }, 30 * 60 * 1000);
  }

  // Claim
  let timeout = 20000; //10s
  let randomQuantity = getRandomInt(140, 150);
  const response = await collectCoin(account, randomQuantity);
  if (response?.statusCode === 201 || response?.statusCode === 200) {
    if (response?.code === 0) {
      timeout = Math.floor((response?.data?.collectAmount / account.coinPoolRecoverySpeed) * 1000);
      console.log("Claim success amount");
    } else {
      console.log("response", response);
    }
  } else {
    handleError(`YesCoin-${account.index} Claim(${response?.statusCode})`, response);
  }

  console.log("DONE AT ", getDateTimeLocal());

  setTimeout(() => {
    run(account, false);
  }, timeout);
}

async function main() {
  for (let index = 0; index < accounts.length; index++) {
    console.log("START ", index);
    let account = accounts[index];
    run(account);
  }
}

main();
