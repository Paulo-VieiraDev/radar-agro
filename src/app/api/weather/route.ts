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

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const city = 'Ivaipora'; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},BR&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar dados do clima');
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

  } catch (error) {
    console.error(error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}