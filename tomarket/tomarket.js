const fs = require("fs");
const path = "./tomarket/tokenData.json"; // File to store the token data
const getNodeFetch = async () => (await import("node-fetch")).default;

// Import accounts data from account.js file
const accountData = require("./accounts.js"); // Adjust the path as per your folder structure

function getRandomPoints() {
  return Math.floor(Math.random() * (450 - 400 + 1)) + 400;
}

// Function to check if token is expired based on expiration timestamp
function isTokenExpired(expirationTime) {
  const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  return expirationTime <= currentTime;
}

// Function to save token data to a file
function saveTokenData(accountId, tokenData) {
  let tokens = {};
  if (fs.existsSync(path)) {
    tokens = JSON.parse(fs.readFileSync(path, "utf-8"));
  }

  tokens[accountId] = tokenData; // Save token data with account id
  fs.writeFileSync(path, JSON.stringify(tokens, null, 2));
  console.log(`Token data for account ${accountId} saved.`);
}

// Function to load token data from the file
function loadTokenData(accountId) {
  if (fs.existsSync(path)) {
    const tokens = JSON.parse(fs.readFileSync(path, "utf-8"));
    return tokens[accountId]; // Return token data for the specific account
  }
  return null;
}

// Function to call the login API
async function callLoginApi(initData, accountId) {
  // Load existing token data
  const tokenData = loadTokenData(accountId);

  // Check if token exists and is not expired
  if (tokenData && !isTokenExpired(tokenData.expiration)) {
    console.log(`Using saved token for account ${accountId}`);
    return tokenData.access_token; // Return saved access token
  }

  // If token is expired or not available, call the login API
  try {
    const fetch = await getNodeFetch();
    const response = await fetch("https://api-web.tomarket.ai/tomarket-game/v1/user/login", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        init_data: initData,
        invite_code: "",
        from: "",
        is_bot: false,
      }),
    });

    const data = await response.json();
    console.log("Login API Response Data:", data);

    if (data.status === 0 && data.data && data.data.access_token) {
      // Save the token and expiration time to the file
      const tokenInfo = {
        access_token: data.data.access_token,
        expiration: data.data.expires_at || Math.floor(Date.now() / 1000) + 3600, // Assuming 1-hour expiration if not provided
      };
      saveTokenData(accountId, tokenInfo);
      return tokenInfo.access_token;
    } else {
      throw new Error("Failed to login or retrieve access_token");
    }
  } catch (error) {
    console.error("Error calling login API:", error);
    return null; // Return null in case of error
  }
}

async function callFirstApi(game_id, token) {
  try {
    const fetch = await getNodeFetch();
    const response = await fetch("https://api-web.tomarket.ai/tomarket-game/v1/game/play", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token,
        "content-type": "application/json",
      },
      body: JSON.stringify({ game_id }),
    });

    const data = await response.json();
    console.log("First API Response Data:", data);
    return data.data.round_id; // Return round_id for the next API call
  } catch (error) {
    console.error("Error calling first API:", error);
    return null; // Return null in case of error
  }
}

async function callSecondApi(game_id, token, roundId) {
  try {
    const fetch = await getNodeFetch();
    const response = await fetch("https://api-web.tomarket.ai/tomarket-game/v1/game/claim", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        game_id, // Use round_id from API 1
        points: getRandomPoints(),
      }),
    });

    const textData = await response.text();
    console.log("Second API Response (Raw):", textData);
  } catch (error) {
    console.error("Error calling second API:", error);
  }
}

async function callShareApi(game_id, token) {
  try {
    const fetch = await getNodeFetch();
    const response = await fetch("https://api-web.tomarket.ai/tomarket-game/v1/game/share", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token,
        "content-type": "application/json",
      },
      body: JSON.stringify({ game_id }),
    });

    const shareData = await response.text();
    console.log("Share API Response (Raw):", shareData);
  } catch (error) {
    console.error("Error calling share API:", error);
  }
}

// Example usage in your main function
async function runAccount(account) {
  const { account_info, name } = account;

  try {
    // Login or retrieve token from file
    const token = await callLoginApi(account_info, name);
    if (!token) throw new Error("Login failed");

    for (let i = 0; ; i++) {
      // Infinite loop until an error occurs
      const gameId = "59bcd12e-04e2-404c-a172-311a0084587d";
      const roundId = await callFirstApi(gameId, token);
      if (!roundId) throw new Error("------------ Invalid Game Chances ------------------");

      // Wait a random amount of time before calling API 2
      const randomWaitTime = Math.floor(Math.random() * (35 - 31 + 1)) + 31;
      console.log(`Waiting ${randomWaitTime} seconds before calling API 2...`);
      await new Promise((resolve) => setTimeout(resolve, randomWaitTime * 1000));

      await callSecondApi(account_info, token, roundId);

      console.log("Calling the Share API...");

      const shareGameId = "53b22103-c7ff-413d-bc63-20f6fb806a07";
      //await callShareApi(shareGameId, token);

      // Wait 5 seconds before the next iteration
      console.log("Waiting 5 seconds before calling API 1 again...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.error(`\x1b[31mError in account ${name}:\x1b[0m`, error.message); // Red color for error
    console.log("\x1b[33mSwitching to the next account...\x1b[0m"); // Yellow color for switching message
    console.log("\n");
  }
}

async function claimRewards(gameId, token) {
  try {
    const fetch = await getNodeFetch();
    const response = await fetch("https://api-web.tomarket.ai/tomarket-game/v1/farm/claim", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: token,
        "content-type": "application/json",
        origin: "https://mini-app.tomarket.ai",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({ game_id: gameId }),
    });

    const data = await response.json();
    console.log("Claim API Response Data:", data);
  } catch (error) {
    console.error("Error claiming rewards:", error);
  }
}

async function runAllAccounts() {
  for (const account of accountData) {
    console.log(`\x1b[32mRunning account with name: ${account.name}\x1b[0m`);
    await runAccount(account); // Run each account sequentially
  }
}
// Start running the accounts
runAllAccounts();
