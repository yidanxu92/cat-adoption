// pages/api/scrape.js
import scrapeCats from '../../src/utils/scrapeWithPuppeteer';

export default async function handler(req, res) {
  try {
    const cats = await scrapeCats();
    res.status(200).json(cats);
  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ error: 'Scraping failed' });
  }
}
