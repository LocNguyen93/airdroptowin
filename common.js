const fs = require('fs');
const path = require('path');

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


const colours = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
    crimson: "\x1b[38m" // Scarlet
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    gray: "\x1b[100m",
    crimson: "\x1b[48m"
  }
};

function writeFile(folderName, file, index, newText, dataReplace) {
  const configFilePath = path.join(__dirname, folderName, file);
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    let accountsData;
    try {
      accountsData = eval(data); // Parse JSON-like content
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return;
    }
    console.log("initData new >>>>>", newText);
    accountsData.accounts[index][dataReplace] = newText;

    const updatedContent = `let accounts = ${JSON.stringify(accountsData?.accounts, null, 2)};\n module.exports = { accounts };\n`;
    fs.writeFile(configFilePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('File config.js has been updated.');
    });
  });
}

module.exports = { getRandomInt, countdown, sleep, getDateTimeLocal, handleError, colours, writeFile };
