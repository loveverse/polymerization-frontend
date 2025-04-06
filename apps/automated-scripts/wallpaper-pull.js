const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const {HttpsProxyAgent} = require("https-proxy-agent")

// 代理地址（需要自己找）
const PROXY = 'http://127.0.0.1:10809';  // 这里是你的代理地址，端口根据代理软件设置

// axios 请求配置
const axiosInstance = axios.create({
  proxy: false, // 先关闭默认代理模式
  httpsAgent: new HttpsProxyAgent(PROXY),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  }
});

// Wallhaven 分类 URL
const BASE_URL = 'https://wallhaven.cc';
const CATEGORIES = {
  'general': 'https://wallhaven.cc/latest?categories=100',
  'anime': 'https://wallhaven.cc/latest?categories=010',
  'people': 'https://wallhaven.cc/latest?categories=001',
};

// 伪装请求头
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
};

// 请求间隔 (单位: ms)
const REQUEST_DELAY = 3000;

// 随机延迟函数 (防止被封)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 获取分类下所有壁纸信息（缩略图 + 详情页链接）
async function fetchWallpapers(categoryName, categoryUrl) {
  try {
    console.log(`抓取分类: ${categoryName}`);
    const {data} = await axiosInstance.get(categoryUrl, {headers: HEADERS});
    const $ = cheerio.load(data);
    const wallpapers = [];

    $('.thumb-listing-page .thumb').each((index, element) => {
      const thumbnail = $(element).find('img').attr('data-src') || $(element).find('img').attr('src');
      const detailPage = $(element).find('a.preview').attr('href');

      if (thumbnail && detailPage) {
        wallpapers.push({category: categoryName, thumbnail, detailPage});
      }
    });

    console.log(`分类 [${categoryName}] 抓取到 ${wallpapers.length} 张壁纸`);
    return wallpapers;
  } catch (error) {
    console.error(`获取分类 [${categoryName}] 失败:`, error.message);
    return [];
  }
}

// 解析高清图片地址
async function fetchHDImage(detailPage) {
  try {
    await sleep(REQUEST_DELAY);  // 避免短时间内请求过多
    const {data} = await axiosInstance.get(detailPage, {headers: HEADERS});
    const $ = cheerio.load(data);
    const hdImage = $('#wallpaper').attr('src');
    return hdImage || null;
  } catch (error) {
    console.error(`解析高清图片失败 [${detailPage}]:`, error.message);
    return null;
  }
}

// 下载图片
async function downloadImage(url, filepath) {
  try {
    const response = await axiosInstance({
      url, method: 'GET', responseType: 'stream', headers: HEADERS
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`下载图片失败: ${url}`, error.message);
  }
}

// 主函数
async function main() {
  let allWallpapers = [];
  const outputDir = path.join(__dirname, 'wallpapers');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const [categoryName, categoryUrl] of Object.entries(CATEGORIES)) {
    const wallpapers = await fetchWallpapers(categoryName, categoryUrl);

    for (let wallpaper of wallpapers) {
      wallpaper.hdImage = await fetchHDImage(wallpaper.detailPage);

      if (wallpaper.hdImage) {
        const filename = path.basename(wallpaper.hdImage);
        const filepath = path.join(outputDir, filename);
        await downloadImage(wallpaper.hdImage, filepath);
        console.log(`下载完成: ${filename}`);
      }
      await sleep(REQUEST_DELAY); // 避免频繁请求
    }

    allWallpapers = allWallpapers.concat(wallpapers);
  }

  const outputFile = path.join(__dirname, 'wallpapers.json');
  fs.writeFileSync(outputFile, JSON.stringify(allWallpapers, null, 2), 'utf-8');

  console.log(`所有壁纸抓取完成，共 ${allWallpapers.length} 张`);
}

main();
