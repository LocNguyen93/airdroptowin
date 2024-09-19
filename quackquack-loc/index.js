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

async function callApiCollect2(account, type) {
  let data = qs.stringify({
    'nest_id': type
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
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
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

async function callApiCollectDuck(account, nestId) {
  let data = qs.stringify({
    'nest_id': `${nestId}`
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
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-site', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
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

const rare = [8, 9, 10, 11, 12, 13]

async function LeyEggAndRemoveAndHactAndCollectDuck(account, nestId, listDuck) {

  listDuck.sort(function (a, b) {
    return b.total_rare - a.total_rare;
  });
  const randomNum = getRandomInt(0, 21); //Change duck
  const duckId = listDuck[randomNum]?.id;

  const layEggRes = await callApiLayEgg(account, nestId, duckId);
  if (layEggRes?.statusCode === 201 || layEggRes?.statusCode === 200) {
    console.log("Lay egg", nestId, duckId, layEggRes?.data?.name);

    let numbers = layEggRes?.data?.name.match(/\d/g).map(Number);
    for (const index of rare) {
      if (numbers[0] === index) {
        console.log("\x1b[31m", "Egg", layEggRes?.data?.name, layEggRes?.data);
      
        const randomNum2 = getRandomInt(10, 21); //Change duck
        const duckIdRemove = listDuck[randomNum2]?.id;

        const removeRes = await callApiRemoveDuck(account, duckIdRemove);
        console.log("Remove duck", duckIdRemove);
        if (removeRes?.statusCode === 201 || removeRes?.statusCode === 200) {
          await callApiHatchDuck(account, nestId);
          await callApiCollectDuck(account, nestId);
          console.log("Hatch and collect duck");
        }
      }
    }
  }
}

async function run() {
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    const collectType = accounts[index]?.collectType;
    console.log("start account --> ", index);
    let countCollect = 1;

    for (let index2 = 0; index2 < collectType.length; index2++) {
      await sleep(2000);

      const reloadRes = await callApiReload(account);
      if (reloadRes?.statusCode === 201 || reloadRes?.statusCode === 200) {
        const data = reloadRes?.data?.nest;
        let listDuck = reloadRes?.data?.duck;
        const nestId = data[index2].id;
        const type = collectType[index2];

        console.log("Egg nest:", nestId, type, " Status:", data[index2].status === 1 ? "Not egg" : "Had egg", "Data", data[index2].status);
        if (nestId === type) {
          if (data[index2].status === 2) {
            const collecttRes = await callApiCollect(account, nestId);
            await sleep(1000);
            if (collecttRes?.statusCode === 201 || collecttRes?.statusCode === 200) {
              console.log("Collect nest >>>>>>>>>>>>>>>>>>>>>>: ", nestId);
              await LeyEggAndRemoveAndHactAndCollectDuck(account, nestId, listDuck);
            } else {
              console.log("Collect fail nest: ", nestId);
            }
          }else if (data[index2].status === 3) {
            const collecttRes = await callApiCollect2(account, nestId);
            await sleep(1000);
            if (collecttRes?.statusCode === 201 || collecttRes?.statusCode === 200) {
              console.log("Collect nest >>>>>>>>>>>>>>>>>>>>>>: ", nestId);
              await LeyEggAndRemoveAndHactAndCollectDuck(account, nestId, listDuck);
            } else {
              console.log("Collect fail nest: ", nestId);
            }
          } else {
            await LeyEggAndRemoveAndHactAndCollectDuck(account, nestId, listDuck);
          }
        } else {
          console.log("Collect fail nest: ", nestId, nestId);
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
  }, 60);
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

run();
