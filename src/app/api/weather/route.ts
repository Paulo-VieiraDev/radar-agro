import { NextResponse } from 'next/server';

export interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  city: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityParam = searchParams.get('city');

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const city = cityParam || 'Ivaipora';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},BR&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) {
        return new NextResponse(JSON.stringify({ message: 'Cidade não encontrada.' }), { status: 404 });
      }
      return new NextResponse(JSON.stringify({ message: 'Erro ao buscar dados do clima.' }), { status: response.status });
    }

    const data = await response.json();

    const weatherData: WeatherData = {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      city: data.name,
    };

    return NextResponse.json(weatherData);

  } catch (error: any) {
    console.error(error);

    if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
      return new NextResponse(JSON.stringify({ message: 'Servidor de clima demorou para responder.' }), { status: 504 }); // 504 Gateway Timeout
    }

    return new NextResponse(JSON.stringify({ message: 'Erro interno do servidor.' }), { status: 500 });
  }
}