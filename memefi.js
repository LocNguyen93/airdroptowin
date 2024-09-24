function generateRandomSequence(size) {
  const min = 1;
  const max = 4;
  const result = [];
  for (let i = 0; i < size; i++) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    result.push(randomNum);
  }
  return result.join(",");
}

async function sendRequest(mineConfig, tabs) {
  const { nonce, authorization } = mineConfig;
  const min = 100;
  const max = 2000;
  //const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  const randomNumber = tabs;
  const vector = generateRandomSequence(randomNumber);
  try {
    console.log("randomNumber", randomNumber);
    const response = await fetch("https://api-gw-tg.memefi.club/graphql", {
      method: "POST",
      headers: {
        accept: "*/*",
        "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
        authorization: authorization,
        "content-language": "en-GB",
        "content-type": "application/json",
        origin: "https://tg-app.memefi.club",
        priority: "u=1, i",
        referer: "https://tg-app.memefi.club/",
        "sec-ch-ua": '"Android Chromium";v="124", "Android Google Chrome";v="124", "Not-A.Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Android",
      },
      body: JSON.stringify({
        operationName: "MutationGameProcessTapsBatch",
        variables: {
          payload: {
            nonce: nonce,
            tapsCount: randomNumber,
            vector: vector,
          },
        },
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
      zonesCount
      tapsReward
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
      spinEnergyNextRechargeAt
      spinEnergyNonRefillable
      spinEnergyRefillable
      spinEnergyTotal
      spinEnergyStaticLimit
      __typename
    }`,
      }),
    });
    const responseData = await response.json();
    console.log(responseData);
    const { nonce: newNonce, currentEnergy, coinsAmount, currentBoss } = responseData.data.telegramGameProcessTapsBatch;

    localStorage.setItem("nonce", newNonce);
    console.log("last nonce:", newNonce);
    console.log("coinsAmount:", coinsAmount);
    console.log("currentEnergy:", currentEnergy);
    console.log("currentBoss:", currentBoss.currentHealth);


    var countdown = 3500;
    const intervalId = setInterval(function () {
      countdown = countdown - 1000;
      console.log(`Countdown: ${countdown / 1000}ms`);
    }, 1000);

    window.run = setTimeout(function () {
      console.log("run");
      var myNonce = localStorage.getItem("nonce");
      sendRequest({ ...mineConfig, nonce: myNonce }, tabs);

      // Stop the countdown once the timeout completes
      clearInterval(intervalId);
    }, countdown);
  } catch (error) {
    console.error("Error:", error);
  }
}

const lastNonce = localStorage.getItem("nonce") ?? "5ebae5a214c3a8c08ee987f1db7c479b255f97ab2f131a6d6975b5126e856bdd";
if (Boolean(lastNonce)) {
  await sendRequest(
    {
      nonce: lastNonce,
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2NjVkYmYxNzFiY2IzNDQwZDE4ZTFiNyIsInVzZXJuYW1lIjoiIn0sInNlc3Npb25JZCI6IjY2OTcyM2M0N2U1YjA4NTEwNDQ2YWFiNCIsInN1YiI6IjY2NjVkYmYxNzFiY2IzNDQwZDE4ZTFiNyIsImlhdCI6MTcyMTE4MTEyNCwiZXhwIjoxNzI4OTU3MTI0fQ.ueCmqB8CDHaAbYJxZ4SQ_2tcinocUKBvfh39y0spgdo",
    },
    50000,
  );
} else {
  console.log("Please input nonce");
}

function stop() {
  clearTimeout(window.run);
}
