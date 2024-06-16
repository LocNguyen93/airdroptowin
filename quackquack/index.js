const axios = require("axios")
const { getDateTimeLocal, getRandomInt } = require("../common");
const { accounts } = require("./config");
const qs = require('qs');

async function callApiReload(account) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.quackquack.games/nest/list-reload',
    headers: {
      'accept': '*/*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'authorization': `Bearer ${account?.token}`,
      'if-none-match': 'W/"14e7-wO1k1+0gzO7KHvE701UA2am6qCQ"',
      'origin': 'https://game-cdn.quackquack.games',
      'priority': 'u=1, i',
      'referer': 'https://game-cdn.quackquack.games/',
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    }
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

async function callApiCollect(account, type) {
  let data = qs.stringify({
    'nest_id': type
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.quackquack.games/nest/collect',
    headers: {
      'accept': '*/*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'authorization': `Bearer ${account?.token}`,
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://game-cdn.quackquack.games',
      'priority': 'u=1, i',
      'referer': 'https://game-cdn.quackquack.games/',
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    },
    data: data
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

async function callApiBalance(account) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.quackquack.games/balance/get',
    headers: {
      'accept': '*/*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'authorization': `Bearer ${account?.token}`,
      'if-none-match': 'W/"1ad-fyMXZ/UAinwUHskLz+TIC9fb/Ls"',
      'origin': 'https://game-cdn.quackquack.games',
      'priority': 'u=1, i',
      'referer': 'https://game-cdn.quackquack.games/',
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    }
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

async function callApiLayEgg(account, nestId, duckId) {
  let data = qs.stringify({
    'nest_id': `${nestId}`,
    'duck_id': `${duckId}`,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.quackquack.games/nest/lay-egg',
    headers: {
      'accept': '*/*',
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
      'authorization': `Bearer ${account?.token}`,
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://game-cdn.quackquack.games',
      'priority': 'u=1, i',
      'referer': 'https://game-cdn.quackquack.games/',
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    },
    data: data
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

async function callApiRemoveDuck(account, duckId) {
  let data = qs.stringify({
    'ducks': `{"ducks":[${duckId}]}` 
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.quackquack.games/duck/remove',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `Bearer ${account?.token}`,
      'content-type': 'application/x-www-form-urlencoded', 
      'origin': 'https://game-cdn.quackquack.games', 
      'priority': 'u=1, i', 
      'referer': 'https://game-cdn.quackquack.games/', 
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    },
    data : data
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

async function callApiHatchDuck(account, nestId) {
  let data = qs.stringify({
    'nest_id': `${nestId}`
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.quackquack.games/nest/hatch',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `Bearer ${account?.token}`,
      'content-type': 'application/x-www-form-urlencoded', 
      'origin': 'https://game-cdn.quackquack.games', 
      'priority': 'u=1, i', 
      'referer': 'https://game-cdn.quackquack.games/', 
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    },
    data : data
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

async function callApiCollectDuck(account, nestId) {
  let data = qs.stringify({
    'nest_id':  `${nestId}`
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.quackquack.games/nest/collect-duck',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'authorization': `Bearer ${account?.token}`,
      'content-type': 'application/x-www-form-urlencoded', 
      'origin': 'https://game-cdn.quackquack.games', 
      'priority': 'u=1, i', 
      'referer': 'https://game-cdn.quackquack.games/', 
      'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    },
    data : data
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


const collectType = [2594116, 2594117, 2594118, 2626288]

async function LeyEggAndRemoveAndHactAndCollectDuck(account, nestId, duckId ) {
  const layEggRes = await callApiLayEgg(account, nestId, duckId);
  if (layEggRes?.statusCode === 201 || layEggRes?.statusCode === 200) {
    console.log("Lay egg", nestId, duckId, layEggRes?.data?.name);
    if (layEggRes?.data?.name === "egg_3" || layEggRes?.data?.name === "egg_4" || layEggRes?.data?.name === "egg_5" || layEggRes?.data?.name === "egg_6" || layEggRes?.data?.name === "egg_7") {
      console.log("Egg", layEggRes?.data?.name);
      const removeRes = await callApiRemoveDuck(account, duckId);
      console.log("Remove duck", duckId);
      if (removeRes?.statusCode === 201 || removeRes?.statusCode === 200) {
        await callApiHatchDuck(account, nestId);
        await callApiCollectDuck(account, nestId);
        console.log("Hatch and collect duck");
      }
    }
  }
}

async function run() {
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);
    let countCollect = 1;

    for (let index2 = 0; index2 < collectType.length; index2++) {
      await sleep(2000);
      const reloadRes = await callApiReload(account);

      if (reloadRes?.statusCode === 201 || reloadRes?.statusCode === 200) {
        const data = reloadRes?.data?.nest;
        const listDuck = reloadRes?.data?.duck;
        const randomNum = getRandomInt(0, 16); //Change duck
       
        const duckId = listDuck[randomNum]?.id;
        const nestId = data[index2].id;

        console.log("Egg nest:", nestId, " Status:", data[index2].status === 1 ? "Not egg" : "Had egg");
        if (nestId === collectType[index2]) {
          if (data[index2].status == 2) {
            const collecttRes = await callApiCollect(account, collectType[index2]);
            if (collecttRes?.statusCode === 201 || collecttRes?.statusCode === 200) {
              console.log("Collect nest: ", nestId);
              await LeyEggAndRemoveAndHactAndCollectDuck(account, nestId, duckId);
            } else {
              console.log("Collect fail nest: ", nestId);
            }
          } else {
            await LeyEggAndRemoveAndHactAndCollectDuck(account, nestId, duckId);
          }
        } else {
          console.log("Collect fail nest: ", nestId, collectType[index2]);
        }
      } else {
        console.log("Reload fail", reloadRes);
      }
      countCollect = countCollect + 1;
    }

    const balanceRes = await callApiBalance(account);
    if (balanceRes?.statusCode === 201 || balanceRes?.statusCode === 200) {
      console.log("Total eggs ", balanceRes?.data?.data[2]?.balance);
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 50 * 60);
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

run();
