const puppeteer = require('puppeteer');
const fs = require('fs');

const scrapeCats = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let pageNumber = 1;
  const cats = [];
  let hasMorePages = true;

  while (hasMorePages) {
    console.log(`正在爬取第 ${pageNumber} 页...`);
    const url = `https://www.tabbysplace.org/adopt/?fwp_paged=${pageNumber}`;
    await page.goto(url);

    // 检查页面是否有猫咪列表
    const catLinks = await page.$$eval(
      '#adopt-cats .cat-loop .cat-block a',
      links => links.map(link => link.href)
    );

    if (catLinks.length === 0) {
      hasMorePages = false; // 当前页没有猫咪，停止爬取
      console.log('没有更多页面了。');
      break;
    }

    for (const link of catLinks) {
      await page.goto(link);

      const catData = await page.evaluate(() => {

        const catNameElement = document.querySelector('.full-page-header-content.standard-container h2.page-header-header');
        const catName = catNameElement ? catNameElement.textContent.trim() : null;
          
        const imgElement = document.querySelector('.cat-featured');
        const imgSrc = imgElement ? imgElement.style.backgroundImage.match(/url\("(.*?)"\)/)[1] : null;

        const details = {};
        document.querySelectorAll('.cat-data').forEach((section) => {
            const keyElement = section.querySelector('strong');
            const valueElements = section.querySelectorAll('span');
            if (keyElement) {
                const key = keyElement.textContent.trim().toLowerCase().replace(/ /g, '_');
                // Extract values, removing duplicates and ignoring nested spans
                const values = Array.from(valueElements)
                    .map((span) => {
                        // Get text from direct child nodes only, ignoring nested elements
                        return Array.from(span.childNodes)
                            .filter((node) => node.nodeType === Node.TEXT_NODE) // Only process text nodes
                            .map((node) => node.textContent.trim())
                            .join('');
                    })
                    .filter((value) => value) // Remove empty strings
                    .filter((value, index, self) => self.indexOf(value) === index); // Ensure uniqueness

                details[key] = values.length === 1 ? values[0] : values;
            }
        });

        return {
          name: catName,
          img: imgSrc,
          details,
          link: window.location.href,
        };
      });

      cats.push(catData);
      console.log(`爬取了猫咪: ${catData.name}`);
    }

    pageNumber++;
  }

  fs.writeFileSync('./cats.json', JSON.stringify(cats, null, 2));
  console.log('所有猫咪数据已保存到 cats.json');

  await browser.close();
  return cats;
};

scrapeCats();
