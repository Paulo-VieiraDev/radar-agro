import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export interface PriceData {
  commodity: string;
  priceBRL: number;
  priceUSD: number;
  lastUpdate: string;
}

function parsePrice(rawPrice: string): number {
  const cleanedPrice = rawPrice.replace('R$', '').replace(/\u00A0/g, ' ').replace(',', '.').trim();
  return parseFloat(cleanedPrice);
}

export async function GET() {
  const url = 'https://www.cepea.esalq.usp.br/br/indicador/soja.aspx';
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2' });
    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);

    const priceRow = $('#imagenet-indicador1 tbody tr').first();

    if (priceRow.length === 0) {
      throw new Error('Não foi possível encontrar a linha de dados na tabela de preços.');
    }

    const date = priceRow.find('td').eq(0).text().trim();
    const priceBRL_raw = priceRow.find('td').eq(1).text().trim();
    const priceUSD_raw = priceRow.find('td').eq(4).text().trim();

    if (!date || !priceBRL_raw || !priceUSD_raw) {
      throw new Error('Uma das células de dados (data, R$ ou US$) não foi encontrada na linha.');
    }

    const priceData: PriceData = {
      commodity: 'Soja',
      priceBRL: parsePrice(priceBRL_raw),
      priceUSD: parsePrice(priceUSD_raw),
      lastUpdate: date,
    };
    
    return NextResponse.json(priceData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });

  } catch (error) {
    if (browser) await browser.close();
    console.error('Erro no scraper de preços:', error);
    return new NextResponse('Falha ao buscar os dados de cotação', { status: 500 });
  }
}