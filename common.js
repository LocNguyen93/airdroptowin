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

async function getDateTimeLocal() {
  var d = new Date();    
  d = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return d;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { getRandomInt, countdown, sleep, getDateTimeLocal };
