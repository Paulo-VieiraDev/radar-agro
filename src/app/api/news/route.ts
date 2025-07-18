import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer'; 

export interface NewsArticle {
  title: string;
  link: string;
}

export async function GET() {
  const baseUrl = 'https://www.noticiasagricolas.com.br';
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36');
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);
    const articles: NewsArticle[] = [];

    $('ol.ultimas li').each((i, element) => {
      if (i >= 5) {
        return false;
      }

      const linkElement = $(element).find('a');
      const title = linkElement.text().trim();
      let link = linkElement.attr('href') || '';

      if (link && !link.startsWith('http')) {
        link = baseUrl + link;
      }

      if (title && link) {
        articles.push({ title, link });
      }
    });

    if (articles.length === 0) {
      throw new Error('Nenhuma notícia encontrada. A estrutura do site pode ter mudado.');
    }

    return NextResponse.json(articles, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });

  } catch (error) {
    if (browser) await browser.close();
    console.error('Erro no scraper de notícias:', error);
    return new NextResponse('Falha ao buscar as notícias', { status: 500 });
  }
}