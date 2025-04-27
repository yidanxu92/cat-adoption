const puppeteer = require('puppeteer');
const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// 数据库连接配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'catDatabase';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'cats';

const scrapeCats = async () => {
  console.log('Starting cat scraping process...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000); // 设置超时为60秒

  let pageNumber = 1;
  const cats = [];
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      console.log(`Scraping page ${pageNumber}...`);
      const url = `https://www.tabbysplace.org/adopt/?fwp_paged=${pageNumber}`;
      
      await page.goto(url, { waitUntil: 'networkidle2' });

      // 检查是否有猫咪列表
      const catLinks = await page.$$eval(
        '#adopt-cats .cat-loop .cat-block a',
        links => links.map(link => link.href)
      );

      if (catLinks.length === 0) {
        hasMorePages = false;
        console.log('No more pages found');
        break;
      }

      console.log(`Found ${catLinks.length} cats on page ${pageNumber}`);

      for (const link of catLinks) {
        try {
          await page.goto(link, { waitUntil: 'networkidle2' });
          
          const catData = await page.evaluate(() => {
            const catNameElement = document.querySelector('.full-page-header-content.standard-container h2.page-header-header');
            const catName = catNameElement ? catNameElement.textContent.trim() : null;
              
            const imgElement = document.querySelector('.cat-featured');
            const imgSrc = imgElement ? imgElement.style.backgroundImage.match(/url\("(.*?)"\)/)?.[1] : null;

            // 提取描述
            const descriptionElement = document.querySelector('.cat-description');
            const description = descriptionElement ? descriptionElement.textContent.trim() : '';

            const details = {};
            document.querySelectorAll('.cat-data').forEach((section) => {
                const keyElement = section.querySelector('strong');
                const valueElements = section.querySelectorAll('span');
                if (keyElement) {
                    const key = keyElement.textContent.trim().toLowerCase().replace(/ /g, '_');
                    const values = Array.from(valueElements)
                        .map((span) => {
                            return Array.from(span.childNodes)
                                .filter((node) => node.nodeType === Node.TEXT_NODE)
                                .map((node) => node.textContent.trim())
                                .join('');
                        })
                        .filter((value) => value)
                        .filter((value, index, self) => self.indexOf(value) === index);

                    details[key] = values.length === 1 ? values[0] : values;
                }
            });

            return {
              name: catName,
              img: imgSrc,
              details,
              description,
              link: window.location.href,
              updatedAt: new Date().toISOString()
            };
          });

          if (catData.name) {
            // 添加位置信息 - 用于优先级计算
            catData.position = cats.length;
            cats.push(catData);
            console.log(`Scraped cat: ${catData.name}`);
          }
          
          // 添加延迟，避免请求过快
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`Error scraping cat at ${link}:`, error);
        }
      }

      pageNumber++;
    }

    // 保存到本地文件作为备份
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    fs.writeFileSync(`./cats-${timestamp}.json`, JSON.stringify(cats, null, 2));
    console.log(`Scraped ${cats.length} cats, data saved to cats-${timestamp}.json`);

    // 更新数据库
    await updateDatabase(cats);

    return cats;
  } catch (error) {
    console.error('Fatal error during scraping:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('Browser closed');
  }
};

// 数据库更新函数
async function updateDatabase(cats) {
  if (!cats || cats.length === 0) {
    console.warn('No cats to update in database');
    return;
  }

  let client;
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}`);
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log(`Updating ${cats.length} cats in database`);
    
    // 获取现有猫咪数据，用于保留首次添加时间
    const existingCats = await collection.find({}).toArray();
    const existingCatsMap = {};
    existingCats.forEach(cat => {
      existingCatsMap[cat.name] = {
        _id: cat._id,
        firstAddedAt: cat.firstAddedAt || cat.updatedAt || cat.createdAt
      };
    });
    
    // 批量更新操作
    const operations = cats.map(cat => {
      // 保留原始ID和首次添加时间
      const existing = existingCatsMap[cat.name];
      const firstAddedAt = existing ? existing.firstAddedAt : new Date().toISOString();
      
      return {
        updateOne: {
          filter: { name: cat.name },
          update: { 
            $set: {
              ...cat,
              firstAddedAt: firstAddedAt
            }
          },
          upsert: true
        }
      };
    });
    
    const result = await collection.bulkWrite(operations);
    
    console.log(`Database update complete: ${result.upsertedCount} inserted, ${result.modifiedCount} modified`);
    
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  scrapeCats()
    .then(() => console.log('Scraping completed successfully'))
    .catch(err => console.error('Scraping failed:', err))
    .finally(() => process.exit());
}

module.exports = { scrapeCats };
