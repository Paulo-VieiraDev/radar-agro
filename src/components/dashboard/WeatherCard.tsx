'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, CloudSun, Wind, Droplets, AlertTriangle, Loader2 } from "lucide-react";
import type { WeatherData } from "@/app/api/weather/route";
import { CityPreferenceDialog } from "./CityPreferenceDialog";
import { useSession } from 'next-auth/react';

const getWeatherIcon = (iconCode: string) => {
  if (iconCode.includes("01")) return <Sun className="w-16 h-16 text-yellow-500" />;
  if (iconCode.includes("02")) return <CloudSun className="w-16 h-16 text-gray-500" />;
  if (iconCode.includes("03") || iconCode.includes("04")) return <Cloud className="w-16 h-16 text-gray-500" />;
  if (iconCode.includes("09") || iconCode.includes("10")) return <CloudRain className="w-16 h-16 text-blue-500" />;
  return <Sun className="w-16 h-16 text-yellow-500" />;
};

export function WeatherCard({ initialCity }: { initialCity: string | null }) {
  const { data: session } = useSession();
  const [city, setCity] = useState(initialCity || '');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialCity && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`/api/geocode/reverse?lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data.city) {
              setCity(data.city);
            }
          } catch (e) {
            console.error("Erro ao buscar cidade por geolocalização", e);
            setError("Não foi possível buscar sua cidade.");
            setCity("Ivaiporã");
          }
        },
        (geoError) => {
          console.error("Permissão de geolocalização negada.", geoError);
          setError("Localização negada. Mostrando clima para a cidade padrão.");
          setCity("Ivaiporã");
        }
      );
    }
  }, [initialCity]);

  useEffect(() => {
    if (!city) {
      if (!initialCity) setIsLoading(false);
      return;
    }

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

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Clima em {weather?.city || city || 'Buscando...'}</span>
          {session && <CityPreferenceDialog currentCity={city} />}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[150px] flex flex-col justify-center">
        {isLoading ? (
          <div className="flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center text-destructive">
            <AlertTriangle className="w-10 h-10 mb-2" />
            <p className="font-semibold">Erro ao carregar</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : weather ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-6">
              {getWeatherIcon(weather.icon)}
              <div className="text-6xl font-bold">{Math.round(weather.temp)}°C</div>
            </div>
            <div className="flex justify-around text-center">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-blue-400"/>
                <div>
                  <p className="font-semibold">{weather.humidity}%</p>
                  <p className="text-xs text-muted-foreground">Umidade</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-gray-400"/>
                <div>
                  <p className="font-semibold">{(weather.wind_speed * 3.6).toFixed(1)} km/h</p>
                  <p className="text-xs text-muted-foreground">Vento</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}