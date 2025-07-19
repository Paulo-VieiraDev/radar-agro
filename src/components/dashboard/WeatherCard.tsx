'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, CloudSun, Wind, Droplets, AlertTriangle, Loader2, Thermometer } from "lucide-react";
import type { WeatherData } from "@/app/api/weather/route";
import { CityPreferenceDialog } from "./CityPreferenceDialog";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const getWeatherIcon = (code: number, size: 'large' | 'small' = 'large') => {
  const className = size === 'large' ? "w-24 h-24" : "w-6 h-6";
  if ([0, 1].includes(code)) return <Sun className={`${className} text-yellow-500`} />;
  if ([2].includes(code)) return <CloudSun className={`${className} text-gray-500`} />;
  if ([3].includes(code)) return <Cloud className={`${className} text-gray-400`} />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className={`${className} text-blue-500`} />;
  return <Sun className={`${className} text-yellow-500`} />;
};

const getDayOfWeek = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
};

export function WeatherCard() {
  const [city, setCity] = useState('Ivaiporã');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!city) return;
    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/weather?city=${city}`);
        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.message || 'Erro ao buscar dados do clima');
        }
        const data: WeatherData = await response.json();
        setWeather(data);
      } catch (err: any) {
        setError(err.message);
        setWeather(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeatherData();
  }, [city]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    if (error) {
      return <div className="flex flex-col items-center justify-center text-center h-full text-destructive"><AlertTriangle className="w-10 h-10 mb-2" /><p className="font-semibold">{error}</p></div>;
    }
    if (weather) {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-4 w-full">
                  {getWeatherIcon(weather.current.weather_code)}
                  <div className="flex flex-col">
                      <div className="text-7xl font-bold">{Math.round(weather.current.temp)}°C</div>
                      <div className="text-lg text-muted-foreground capitalize -mt-1">{weather.description}</div>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mt-4">
                  <div className="flex items-center"><Thermometer className="w-4 h-4 mr-1.5 text-red-500" /><span>Max: {Math.round(weather.forecast[0].temp_max)}°</span></div>
                  <div className="flex items-center"><Droplets className="w-4 h-4 mr-1.5 text-blue-400" /><span>{weather.current.humidity}%</span></div>
                  <div className="flex items-center"><Thermometer className="w-4 h-4 mr-1.5 text-blue-500" /><span>Min: {Math.round(weather.forecast[0].temp_min)}°</span></div>
                  {typeof weather.current.wind_speed === 'number' && (
                      <div className="flex items-center"><Wind className="w-4 h-4 mr-1.5 text-gray-400" /><span>{weather.current.wind_speed.toFixed(1)} km/h</span></div>
                  )}
              </div>
            </div>
            <div className="w-full h-24 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weather.hourly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="temp" stroke="#8884d8" fill="url(#colorTemp)" />
                  <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} interval={5} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                  <Tooltip 
                    formatter={(value: number) => [value.toFixed(1) + '°C', 'Temp.']}
                    labelStyle={{ fontSize: 12 }}
                    contentStyle={{ fontSize: 14, border: 'none', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full pt-4 border-t">
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {weather.forecast.map(day => (
                <div key={day.date} className="flex flex-col items-center p-1 rounded-md">
                  <span className="font-semibold uppercase">{getDayOfWeek(day.date)}</span>
                  {getWeatherIcon(day.weather_code, 'small')}
                  <div className="flex items-center text-xs"><Thermometer className="w-3 h-3 mr-1 text-red-500" /><span>{Math.round(day.temp_max)}°</span></div>
                  <div className="flex items-center text-xs text-muted-foreground"><Thermometer className="w-3 h-3 mr-1 text-blue-500" /><span>{Math.round(day.temp_min)}°</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Clima em {city}</span>
          <CityPreferenceDialog currentCity={city} onCityChange={setCity} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {renderContent()}
      </CardContent>
    </Card>
  );
}