const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApiLogin(account) {
  let data = JSON.stringify({
    sid: account?.sid,
    id: account?.id,
    auth: account?.auth,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://gemzcoin.us-east-1.replicant.gc-internal.net/gemzcoin/v2.26.2/loginOrCreate",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
      "content-type": "application/json",
      origin: "https://ff.notgemz.gemz.fun",
      priority: "u=1, i",
      referer: "https://ff.notgemz.gemz.fun/",
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
      console.log("errorLogin");
      return { statusCode: error?.response?.status };
    });

  return result;
}

async function callApi(account, infoClaim) {
  let queue = [];
  for (let index = 0; index < 10000; index++) {
    let item = {
      async: false,
      fn: "tap",
      meta: {
        now: new Date().getTime(),
      },
    };
    queue.push(item);
  }
  let data = JSON.stringify({
    clientRandomSeed: 0,
    consistentFetchIds: [],
    crqid: infoClaim?.crqid,
    id: account?.id,
    auth: infoClaim?.token,
    queue: queue,
    requestedProfileIds: [],
    rev: infoClaim?.rev,
    sid: infoClaim?.sid,
    abTestsDynamicConfig: {
      "0002_invite_drawer": { active: true, rollOut: 1 },
      "0003_invite_url": { active: true, rollOut: 1 },
      "0004_invite_copy": { active: true, rollOut: 1 },
      "0005_invite_message": { active: true, rollOut: 1 },
      "0006_daily_reward": { active: false, rollOut: 0 },
      "0007_game_preview": { active: false, rollOut: 0 },
      "0008_retention_with_points": { active: true, rollOut: 1 },
      "0010_localization": { active: true, rollOut: 1 },
      "0011_earn_page_buttons": { active: true, rollOut: 1 },
      "0012_rewards_summary": { active: true, rollOut: 1 },
      "0014_gift_airdrop": { active: true, rollOut: 1 },
      "0015_dao_card": { active: true, rollOut: 1 },
      "0016_throttling": { active: true, rollOut: 1 },
      "0016_throttling_v2": { active: true, rollOut: 1 },
      "0018_earn_page_button_2_friends": { active: true, rollOut: 1 },
      "0022_localization": { active: true, rollOut: 1 },
      "0023_earn_page_button_connect_wallet": { active: true, rollOut: 1 },
      "0024_rewards_summary2": { active: true, rollOut: 1 },
      "0025_invite_btn_locked_cards": { active: true, rollOut: 1 },
      "0028_mining_page_route": { active: false, rollOut: 0 },
      "0029_mining_special_initial_tab": { active: false, rollOut: 0 },
      "0031_free_gift_modal": { active: true, rollOut: 1 },
      "0035_elim_reengage_msgs": { active: true, rollOut: 1 },
    },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://gemzcoin.us-east-1.replicant.gc-internal.net/gemzcoin/v2.26.2/replicate",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "vi,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      origin: "https://ff.notgemz.gemz.fun",
      priority: "u=1, i",
      referer: "https://ff.notgemz.gemz.fun/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
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
      console.log("errorClaim");
      return { statusCode: error?.response?.status };
    });

  return result;
}

async function run() {
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);
    const response = await callApiLogin(account);
    if (response?.statusCode == 200) {
      const infoClaim = {
        token: response?.data?.token,
        crqid: response?.data?.metainfo?.lastClientRequestId,
        sid: response?.data?.metainfo?.lastSessionId,
        rev: response?.data?.rev,
      };
      const resClaim = await callApi(account, infoClaim);
      if (resClaim?.status == 200) {
        console.log(`Gemz-${index} startGemz successfully!`);
      } else {
        console.log(`Gemz-${index} startGemz Error!`);
      }
      console.log("resClaim", resClaim);
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 30 * 1000 * 60);
}

run();
