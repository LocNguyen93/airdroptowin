function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function countdown(seconds) {
  for (let i = seconds; i >= 0; i--) {
    console.log(i); // In ra số giây còn lại
    await sleep(1000); // Tạm dừng 1 giây
  }
  console.log("Countdown complete!");
}

function getDateTimeLocal() {
  var d = new Date().toLocaleString();
  return `\x1b[36m ` + d + ` \x1b[0m`;
}

function handleError(key, response) {
  console.log("ERROR-----------------------------------");
  console.log(`${key} :`, JSON.stringify(response));
  telegram.send(key, JSON.stringify(response));
}


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { getRandomInt, countdown, sleep, getDateTimeLocal, handleError };
