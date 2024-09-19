const { accounts } = require("./config");
const getKeyConfig2M = {
  vector: "1,4,2,2", /// Setting change every day
};

async function callApiClaim(account) {
  const { nonce, boot, authorization } = account;
  const vector = getKeyConfig2M.vector;
  const tabCounts = vector.split(",").length;

  let data = {
    query: `mutation MutationGameProcessTapsBatch($payload: TelegramGameTapsBatchInput!) {
      telegramGameProcessTapsBatch(payload: $payload) {
        ...FragmentBossFightConfig
        __typename
      }
    }
    
    fragment FragmentBossFightConfig on TelegramGameConfigOutput {
      _id
      coinsAmount
      currentEnergy
      maxEnergy
      weaponLevel
      energyLimitLevel
      energyRechargeLevel
      tapBotLevel
      currentBoss {
        _id
        level
        currentHealth
        maxHealth
        __typename
      }
      freeBoosts {
        _id
        currentTurboAmount
        maxTurboAmount
        turboLastActivatedAt
        turboAmountLastRechargeDate
        currentRefillEnergyAmount
        maxRefillEnergyAmount
        refillEnergyLastActivatedAt
        refillEnergyAmountLastRechargeDate
        __typename
      }
      bonusLeaderDamageEndAt
      bonusLeaderDamageStartAt
      bonusLeaderDamageMultiplier
      nonce
      __typename
    }`,
    variables: { payload: { nonce: nonce, tapsCount: tabCounts, vector: vector } },
  };

  let config = {
    method: "POST",
    headers: {
      accept: "*/*",
      "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5",
      authorization: `Bearer ${authorization}`,
      "content-type": "application/json",
      dnt: "1",
      origin: "https://tg-app.memefi.club",
      priority: "u=1, i",
      referer: "https://tg-app.memefi.club/",
      "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch("https://api-gw-tg.memefi.club/graphql", config);
    const responseData = await response.json();
    const { nonce: newNonce, currentEnergy, coinsAmount } = responseData.data.telegramGameProcessTapsBatch;

    console.log("nonce:", newNonce);
    console.log("coinsAmount:", coinsAmount);
    console.log("currentEnergy:", currentEnergy);
  } catch (error) {
    console.error("Error:", error);
  }
}


async function run() {
  for (let index = 0; index < accounts.length; index++) {
    console.log("start account --> ", index);
    let account = accounts[index];
    let isRun = true;
    while (isRun) {
      const response = await callApiClaim(account);
      console.log("callApiClaim", response);
      isRun = false;
    }
    console.log("DONE AT ", new Date());
    setTimeout(() => {
      run();
    }, 30 * 1000 * 60);
  }
}

run();
