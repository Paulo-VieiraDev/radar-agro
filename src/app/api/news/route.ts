import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export interface NewsArticle {
  title: string;
  link: string;
  imageUrl: string | null;
  tag: string | null;
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

    const selector = 'div.noticias-em-destaque a.box-destaque, div.noticias-em-destaque div.caixa a';

    $(selector).each((i, element) => {
      const linkElement = $(element);
      const title = linkElement.find('div.titulo, div.titulo-principal').text().trim();
      let link = linkElement.attr('href') || '';
      let imageUrl = linkElement.find('img').attr('data-src') || linkElement.find('img').attr('src') || null;
      const tag = linkElement.find('div.tag-not').text().trim() || null;

      if (link && !link.startsWith('http')) {
        link = baseUrl + link;
      }
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = baseUrl + imageUrl;
      }

      if (title && link) {
        articles.push({ title, link, imageUrl, tag });
      }
    });

    const finalArticles = articles.slice(0, 6); 

    if (finalArticles.length === 0) {
      throw new Error('Nenhuma notícia com imagem encontrada.');
    }

    return NextResponse.json(finalArticles);

  } catch (error) {
    if (browser) await browser.close();
    console.error('Erro no scraper de notícias:', error);
    return new NextResponse('Falha ao buscar as notícias', { status: 500 });
  }
}