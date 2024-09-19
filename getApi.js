
const puppeteer = require('puppeteer');
const data = "https://zavod.mdaowallet.com/#tgWebAppData=query_id%3DAAGiL6YdAAAAAKIvph1RczsY%26user%3D%257B%2522id%2522%253A497430434%252C%2522first_name%2522%253A%2522NTL%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522ntl0301%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522is_premium%2522%253Atrue%252C%2522allows_write_to_pm%2522%253Atrue%257D%26auth_date%3D1718718433%26hash%3Dba55756120653e02e15ecc9138e3845afeb285b63b695faa6ec215df7c5434f7&tgWebAppVersion=7.4&tgWebAppPlatform=android&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%233390ec%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23707579%22%2C%22link_color%22%3A%22%2300488f%22%2C%22secondary_bg_color%22%3A%22%23f4f4f5%22%2C%22text_color%22%3A%22%23000000%22%2C%22header_bg_color%22%3A%22%23ffffff%22%2C%22accent_text_color%22%3A%22%233390ec%22%2C%22section_bg_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%233390ec%22%2C%22subtitle_text_color%22%3A%22%23707579%22%2C%22destructive_text_color%22%3A%22%23df3f40%22%7D";


async function getTelegramInitData(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Điều khiển trình duyệt để lắng nghe các yêu cầu mạng
  await page.setRequestInterception(true);
  page.on('request', request => {
    request.continue();
  });

  let initData = null;
  page.on('response', async response => {
    const request = response.request();
    const headers = request.headers();

    // Kiểm tra xem header có chứa 'telegram-init-data' hay không
    if (headers['telegram-init-data']) {
      initData = headers['telegram-init-data'];
    }
  });

  await page.goto(url);

  // Chờ một chút để đảm bảo tất cả các yêu cầu đã hoàn thành
  await new Promise(resolve => setTimeout(resolve, 8000));

  await browser.close();

  return initData;
}

// Ví dụ sử dụng hàm để lấy thông tin từ Telegram Web
(async () => {
  console.log('Start =>>>>>>>>>>>>>>>>>');
  const url = data; // Thay đổi URL nếu cần
  try {
    const initData = await getTelegramInitData(url);
    console.log('Telegram-Init-Data:', initData);
  } catch (error) {
    console.error('Error:', error);
  }
})();