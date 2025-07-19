import { NextResponse } from 'next/server';

export interface WeatherData {
  current: {
    temp: number;
    weather_code: number;
    wind_speed: number;
    humidity: number;
  };
  forecast: {
    date: string;
    weather_code: number;
    temp_max: number;
    temp_min: number;
  }[];
  hourly: {
    time: string;
    temp: number;
  }[];
  city: string;
  description: string;
}

const getWeatherDescription = (code: number): string => {
  const descriptions: { [key: number]: string } = {
    0: 'Céu limpo', 1: 'Quase limpo', 2: 'Parcialmente nublado', 3: 'Nublado',
    45: 'Nevoeiro', 48: 'Nevoeiro gelado',
    51: 'Chuvisco leve', 53: 'Chuvisco moderado', 55: 'Chuvisco forte',
    61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
    80: 'Pancadas de chuva', 81: 'Pancadas de chuva', 82: 'Pancadas de chuva',
  };
  return descriptions[code] || 'Condição desconhecida';
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') || 'Ivaiporã';

  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pt&format=json`);
    const geoData = await geoResponse.json();
    if (!geoData.results?.length) {
      return new NextResponse(JSON.stringify({ message: `Cidade '${city}' não encontrada.` }), { status: 404 });
    }
    const { latitude, longitude, name } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m&timezone=auto`;
    
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const now = new Date();
    const hourlyData = weatherData.hourly.time.map((time: string, index: number) => ({
      time: new Date(time),
      temp: weatherData.hourly.temperature_2m[index],
    }))
    .filter((data: {time: Date}) => data.time > now)
    .slice(0, 24)
    .map((data: {time: Date, temp: number}) => ({
      time: data.time.getHours() + ':00',
      temp: data.temp,
    }));

    const responseData: WeatherData = {
      city: name,
      description: getWeatherDescription(weatherData.current.weather_code),
      current: {
        temp: weatherData.current.temperature_2m,
        weather_code: weatherData.current.weather_code,
        wind_speed: weatherData.current.wind_speed_10m,
        humidity: weatherData.current.relative_humidity_2m,
      },
      forecast: weatherData.daily.time.map((date: string, index: number) => ({
        date: date,
        weather_code: weatherData.daily.weather_code[index],
        temp_max: weatherData.daily.temperature_2m_max[index],
        temp_min: weatherData.daily.temperature_2m_min[index],
      })).slice(0, 7),
      hourly: hourlyData,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Erro na API de clima:', error);
    return new NextResponse(JSON.stringify({ message: 'Erro interno do servidor.' }), { status: 500 });
  }
}