import { scrapeCats } from '../../utils/scrapeWithPuppeteer';

export default async function handler(req, res) {
  // 安全检查 - 可以使用环境变量中的密钥
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.SCRAPER_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting cat database update...');
    const cats = await scrapeCats();
    return res.status(200).json({ 
      success: true, 
      message: `Updated ${cats.length} cats` 
    });
  } catch (error) {
    console.error('Error updating cat database:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
} 