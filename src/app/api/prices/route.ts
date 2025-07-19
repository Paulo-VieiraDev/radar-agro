import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export interface PriceHistory {
  date: string;
  price: number;
}

export interface PriceData {
  commodity: string;
  priceBRL: number;
  priceUSD: number;
  lastUpdate: string;
  preposition: string;
  dailyChange: number;
  unit: string;
  history: PriceHistory[];
}

function parsePrice(rawPrice: string): number {
  if (!rawPrice) return 0;
  const cleanedPrice = rawPrice.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  return parseFloat(cleanedPrice);
}

function parsePercentage(rawPercentage: string): number {
  if (!rawPercentage) return 0;
  const cleaned = rawPercentage.replace('%', '').replace(',', '.').trim();
  return parseFloat(cleaned) || 0;
}

const commoditiesConfig = {
  soja: {
    url: 'https://www.cepea.esalq.usp.br/br/indicador/soja.aspx',
    name: 'Soja',
    tableId: '#imagenet-indicador1',
    unit: 'por saca de 60kg',
    preposition: 'da',
  },
  milho: {
    url: 'https://www.cepea.esalq.usp.br/br/indicador/milho.aspx',
    name: 'Milho',
    tableId: '#imagenet-indicador1',
    unit: 'por saca de 60kg',
    preposition: 'do',
  },
  cafe: {
    url: 'https://www.cepea.esalq.usp.br/br/indicador/cafe.aspx',
    name: 'Café',
    tableId: '#imagenet-indicador1',
    unit: 'por saca de 60kg',
    preposition: 'do',
  },
  trigo: {
    url: 'https://www.cepea.esalq.usp.br/br/indicador/trigo.aspx',
    name: 'Trigo',
    tableId: '#imagenet-indicador2',
    unit: 'por tonelada',
    preposition: 'do',
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const commodityKey = searchParams.get('commodity') || 'soja';

  if (!(commodityKey in commoditiesConfig)) {
    return new NextResponse('Commodity inválida', { status: 400 });
  }

  const key = commodityKey as keyof typeof commoditiesConfig;
  const config = commoditiesConfig[key];
  
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36');
    await page.goto(config.url, { waitUntil: 'networkidle2' });
    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);

    const history: PriceHistory[] = [];
    const tableRows = $(`${config.tableId} tbody tr`);

    tableRows.each((index, row) => {
      const cells = $(row).find('td');
      const date = cells.eq(0).text().trim();
      const priceBRL_raw = cells.eq(1).text().trim();
      if (date && priceBRL_raw) {
        history.push({
          date: date.substring(0, 5),
          price: parsePrice(priceBRL_raw),
        });
      }
    });

    if (history.length === 0) {
      throw new Error('Não foi possível capturar o histórico de preços.');
    }

    const latestPriceData = history[0];
    const latestRow = tableRows.first();
    const dailyChange_raw = latestRow.find('td').eq(2).text().trim();
    let priceUSD_raw = latestRow.find('td').eq(4).text().trim();
    if (!priceUSD_raw) priceUSD_raw = latestRow.find('td').eq(3).text().trim();

    const responseData: PriceData = {
      commodity: config.name,
      priceBRL: latestPriceData.price,
      priceUSD: parsePrice(priceUSD_raw),
      lastUpdate: history[0].date,
      preposition: config.preposition,
      dailyChange: parsePercentage(dailyChange_raw),
      unit: config.unit,
      history: history.reverse(),
    };
    
    return NextResponse.json(responseData);

  } catch (error) {
    if (browser) await browser.close();
    console.error(`Erro no scraper de ${config.name}:`, error);
    return new NextResponse(`Falha ao buscar os dados de cotação para ${config.name}`, { status: 500 });
  }
}