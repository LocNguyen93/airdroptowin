const getNodeFetch = async () => (await import("node-fetch")).default;

// Token management
let currentToken = null;
let tokenExpiration = 0;
let tokenPromise = null; // Promise to handle concurrent token refresh requests

// Function to authenticate user and obtain token
async function authenticateUser(account) {
  try {
    const { account_info, name } = account;
    const fetch = await getNodeFetch();
    const response = await fetch(
      "https://user-domain.blum.codes/api/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP",
      {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          lang: "en",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
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
      }
    );

    const data = await response.json();
    console.log("Authentication Response:", data);

    // Return name, access token, and expiration time
    const expirationTime = Date.now() + data.token.expiresIn * 1000; // Assuming expiresIn is in seconds
    return { name, token: data.token.access, expirationTime };
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

// Function to make API call with a specific offset
async function callApi(offset) {
  const url = `https://game-domain.blum.codes/api/v1/daily-reward?offset=${offset}`;

  try {
    const fetch = await getNodeFetch();

    // Ensure token is fetched or refreshed
    await ensureTokenFetched();

    const response = await fetch(url, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        authorization: getAuthorizationHeader(),
        lang: "en",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrerPolicy: "no-referrer",
      method: "GET",
      mode: "cors",
      credentials: "include",
    });

    if (response.status === 401) {
      // Token expired, attempt to refresh token and retry
      await refreshAndRetry(offset);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

// Ensure token is fetched or refreshed
async function ensureTokenFetched() {
  if (!currentToken || Date.now() >= tokenExpiration) {
    // If tokenPromise is already set, wait for it to resolve
    if (!tokenPromise) {
      tokenPromise = refreshToken(); // Set the promise to refresh token
    }
    await tokenPromise; // Wait for tokenPromise to resolve
    tokenPromise = null; // Reset tokenPromise after resolving
  }
}

// Function to refresh token
async function refreshToken() {
  try {
    const authData = await authenticateUser(account);
    if (authData) {
      const { token, expirationTime } = authData;
      updateToken(token, expirationTime);
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

// Function to refresh token and retry API call
async function refreshAndRetry(offset) {
  try {
    await refreshToken(); // Refresh token
    // Retry the API call with the new token
    const newData = await callApi(offset);
    return newData;
  } catch (error) {
    console.error("Error refreshing token and retrying API:", error);
    throw error;
  }
}

function getAuthorizationHeader() {
  if (!currentToken || Date.now() >= tokenExpiration) {
    throw new Error("Token expired or not yet fetched.");
  }
  return `Bearer ${currentToken}`;
}

function updateToken(token, expirationTime) {
  currentToken = token;
  tokenExpiration = expirationTime;
}

// Function to generate an array of offsets
function generateOffsets() {
  const offsets = [];

  // Add negative offsets from -0 to -720 with step 60
  for (let i = 0; i <= 720; i += 60) {
    offsets.push(-i);
  }

  // Add positive offsets from 0 to 720 with step 60
  for (let i = 0; i <= 720; i += 60) {
    offsets.push(i);
  }

  return offsets;
}

// Function to iterate through the offsets and send 5 requests for each offset in parallel
async function iterateOffsets() {
  const offsets = generateOffsets();
  console.log(`offsets ${offsets}:`);
  for (let i = 0; i < offsets.length; i++) {
    try {
      // Create an array of 5 requests for the current offset
      const requests = await Array(5).fill(callApi(offsets[i]));
      console.log(`Offset ${offsets[i]}:`);
      // Send 5 requests in parallel using Promise.all
      const results = await Promise.all(requests);
      console.log(`Results ${results}:`, results);
      // Log the results of all 5 requests for the current offset
    } catch (error) {
      console.error(`Error fetching data for Offset ${offsets[i]}:`, error);
    }
  }
}

async function startInterval() {
  while (true) {
    await iterateOffsets(); // Đợi hàm iterateOffsets hoàn thành
    console.log("Waiting for 5 seconds before the next run...");
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Đợi 5 giây
  }
}

// Account details for authentication
const account = {
  name: "ntl0301",
  account_info:
    "query_id=AAGiL6YdAAAAAKIvph0DE1No&user=%7B%22id%22%3A497430434%2C%22first_name%22%3A%22NTL%20%F0%9F%86%93%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ntl0301%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1726487358&hash=b5bc73a400866ae5d3a0ace22efba24d642cb157f28482da36dce41b7f3274b2",
};

// Start the process
startInterval();
