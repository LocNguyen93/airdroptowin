const axios = require("axios");
const { getDateTimeLocal } = require("../common");
const { accounts } = require("./config");

async function callApi(account) {
  let data = qs.stringify({
    'hash': '4b3db5a748173b5cd403ff7396e76c67463a76bac1f79adedc93efdf73303db6',
    'clicks': 'mJ6X8jUxzVwvlhveHFwv2YLWloMbx5DtfLHwxeUE6uYH5HD5GMAtQu8FzAqH9CSJ8+JB4C5eJ2bWTzVURyr720/Z4on9Yxe2DIBra8jRdbGreEb6RFO+qrWzPtOV5vyg' 
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://e-footballmanager.com/api/clicker',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5', 
      'content-type': 'application/x-www-form-urlencoded', 
      'origin': 'https://e-footballmanager.com', 
      'priority': 'u=1, i', 
      'referer': 'https://e-footballmanager.com/dashboard?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2UtZm9vdGJhbGxtYW5hZ2VyLmNvbS90ZWxlZ3JhbS1sb2dpbiIsImlhdCI6MTcxOTEzNTc0NywiZXhwIjoxNzE5MTM5MzQ3LCJuYmYiOjE3MTkxMzU3NDcsImp0aSI6InpQVnJRblBYZlRMRU1uM3YiLCJzdWIiOiIyNDI5MSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.PUOrOKnPsGzEpQEHG8o9bxGTC1DxPliJ8WEcOk3-f4M', 
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-origin', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', 
      'Cookie': 'XSRF-TOKEN=eyJpdiI6Iit0SVVVbDFUMXEzSjUxQlpHVldJR2c9PSIsInZhbHVlIjoicHoyeW9Nd2tVeXB5bXJtZHltRFBmVXQ4QmlYNURZSHlad0FFRFpiNmJuM2kxQTlGWDAwcTlkRVpiWXliZzBBWE5vL0ZtYXg1L0ozN3N3dWNlVHM0YXF4eGJIcC82Z3JNdk9QWXhhdnFtQjBNRFNQL3dWU3lEWDlGbmFNSEtzdksiLCJtYWMiOiI2ZDBmNWI0NGY0NzJkNWZmNDBmNzQ3Y2YzM2Q1ZDRiODU4YmNiNDFhNmNiNDVkMTFhZjAxZWEzNWQ0MTliMTM1IiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6InV6a2tsNEtzTzlHTGJDWjM0QUREL2c9PSIsInZhbHVlIjoiUlQxZVNNTGtjUWNtcEg1WWhtbEEybFlsUFpDd3pCcFF3WnBnUWtHKzFaTGJRNmJUZ3lKYk9ZMjB5ek1HQjBpZnJxQjlUWm1JQWJmcU44MWJhbkVvNVBlYXZ2U2Rhc1hKcTVXeCtlQjhEWWJxM0QxZTBoUWE0TUVIbnNGd2xmVzgiLCJtYWMiOiI4MDEzNTQzYTIyMGI5NTM3Y2EwYWZmZjlkMzNhMWJlOTA2ZTZlMGQ5ZGM4NTA5ODQyYWUyZWIxZDQyMTcwY2VjIiwidGFnIjoiIn0%3D'
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

async function run() {
  for (let index = 0; index < accounts.length; index++) {
    let account = accounts[index];
    console.log("start account --> ", index);
    let isRun = true;
    while (isRun) {
      const response = await callApi(account);
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        console.log("Claim success amount", response?.clickerUser?.earnPassivePerSec);
        isRun = false;
      } else {
        console.log("Job fail", response);
        isRun = false;
      }
    }
  }

  console.log("DONE AT ", getDateTimeLocal());
  setTimeout(() => {
    run();
  }, 15 * 1000 * 60);
}

run();
