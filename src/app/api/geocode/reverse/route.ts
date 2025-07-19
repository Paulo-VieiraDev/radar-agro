import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return new NextResponse(JSON.stringify({ error: 'Latitude e longitude são obrigatórias' }), { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Falha ao buscar o nome da cidade');
    }
    const data = await response.json();

    if (data.length === 0 || !data[0].name) {
      return new NextResponse(JSON.stringify({ error: 'Não foi possível encontrar a cidade para essas coordenadas' }), { status: 404 });
    }

    return NextResponse.json({ city: data[0].name });

  } catch (error) {
    console.error('Erro no reverse geocoding:', error);
    return new NextResponse(JSON.stringify({ error: 'Erro interno do servidor' }), { status: 500 });
  }
}