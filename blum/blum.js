const fs = require("fs");
const path = require("path");
const accounts = require("./accounts"); // Import accounts

const getNodeFetch = async () => (await import("node-fetch")).default;

function getRandomPoints() {
  return Math.floor(Math.random() * (180 - 170 + 1)) + 170;
}

const TOKEN_EXPIRATION_BUFFER = 60 * 1000; // Buffer time before expiration in milliseconds

async function authenticateUser(account) {
  try {
    const { account_info, name } = account;
    const fetch = await getNodeFetch();
    const response = await fetch("https://user-domain.blum.codes/api/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        lang: "en",
        priority: "u=1, i",
        "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        query: account_info,
      }),
      mode: "cors",
      credentials: "omit",
    });

    const data = await response.json();
    console.log("Authentication Response:", data);

    // Return name, access token, and expiration time
    const expirationTime = Date.now() + data.token.expiresIn * 1000; // Assuming expiresIn is in seconds
    return { name, token: data.token.access, expirationTime };
  } catch (error) {
    console.error("Error authenticating user:", error);
  }
}

const readTokens = () => {
  try {
    const tokenData = fs.readFileSync(path.join(__dirname, "tokens.json"));
    return JSON.parse(tokenData);
  } catch (error) {
    console.error("Error reading tokens:", error);
    return [];
  }
};

// Function to check if the token is expired
function isTokenExpired(expirationTime) {
  return expirationTime === null || Date.now() >= expirationTime - TOKEN_EXPIRATION_BUFFER;
}

async function callFirstApi(token) {
  try {
    const fetch = await getNodeFetch();
    const response = await fetch("https://game-domain.blum.codes/api/v1/game/play", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${token}`, // Use the token directly
        lang: "en",
        "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrerPolicy: "no-referrer",
      body: null,
      mode: "cors",
      credentials: "include",
    });

    const data = await response.json();
    console.log("Start API Response Data:", data);
    return data;
  } catch (error) {
    console.error("Error calling first API:", error);
  }
}

async function callSecondApi(gameId, token) {
  try {
    const fetch = await getNodeFetch();
    const randomPoint = getRandomPoints();
    const response = await fetch("https://game-domain.blum.codes/api/v1/game/claim", {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${token}`, // Use the token directly
        "content-type": "application/json",
        lang: "en",
        origin: "https://telegram.blum.codes",
        "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
      },
      body: JSON.stringify({
        gameId: gameId,
        points: randomPoint,
      }),
      referrerPolicy: "no-referrer",
      mode: "cors",
      credentials: "include",
    });
    console.log("Point Claim:", randomPoint);
    const textData = await response.text();
    console.log("Claim API Response (Raw):", textData);
  } catch (error) {
    console.error("Error calling second API:", error);
  }
}

async function run() {
  const tokensArray = readTokens(); // Read tokens once at the beginning

  for (const account of accounts) {
    let name, token, expirationTime;
    const existingTokenData = tokensArray.find((a) => a.name === account.name);

    // Check if there is an existing token and if it is still valid
    if (existingTokenData && !isTokenExpired(existingTokenData.expirationTime)) {
      // Use existing token
      ({ name, token, expirationTime } = existingTokenData);
      console.log(`Using existing token for account: ${name}`);
    } else {
      // Authenticate the user and get a new token
      const authData = await authenticateUser(account);
      if (authData) {
        ({ name, token, expirationTime } = authData);
        tokensArray.push({ name, token, expirationTime }); // Save new token
      } else {
        console.error(`Failed to authenticate account: ${account.name}`);
        continue; // Skip this account if authentication failed
      }
    }

    while (true) {
      // Loop indefinitely until an error occurs
      let breakPoint = false;
      try {
        const data = await callFirstApi(token);
        if (!data.gameId) {
          const { message } = data;
          if (message == "not enough play passes") {
            breakPoint = true;
            throw new Error("------------ Invalid Game Chances ------------------");
          }
        }
        if (data.gameId) {
          const randomWaitTime = Math.floor(Math.random() * (35 - 31 + 1)) + 31;
          console.log(`Waiting ${randomWaitTime} seconds before calling Claim...`);
          await new Promise((resolve) => setTimeout(resolve, randomWaitTime * 1000));
          await callSecondApi(data.gameId, token); // Pass the token to the second API call
        } else {
          console.error("Game ID is undefined. Skipping API Claim call.");
        }
      } catch (error) {
        console.error(`\x1b[31mError in account ${name}:\x1b[0m`, error.message); // Red color for error
        console.log("\x1b[33mSwitching to the next account...\x1b[0m"); // Yellow color for switching message
        console.log("\n");
        if (breakPoint) {
          break; // Exit the loop on error and proceed to the next account
        }
      }

      console.log("\x1b[33---------------------------------------------------------\n\x1b[0m");
      console.log("\x1b[33mWaiting 5 seconds before calling API Start Game again......\x1b[0m");
      console.log("\x1b[33---------------------------------------------------------\x1b[0m");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Save all tokens to a JSON file
  fs.writeFileSync(path.join(__dirname, "tokens.json"), JSON.stringify(tokensArray));
}

run();
