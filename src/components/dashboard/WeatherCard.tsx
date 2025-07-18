import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, CloudSun, Wind, Droplets } from "lucide-react";
import type { WeatherData } from "@/app/api/weather/route";

async function getWeatherData(): Promise<WeatherData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/weather`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) return null;

    return response.json();
  } catch (error) {
    console.error("Falha ao buscar dados do clima no componente:", error);
    return null;
  }
}

const getWeatherIcon = (iconCode: string) => {
  if (iconCode.includes("01")) return <Sun className="w-16 h-16 text-yellow-500" />;
  if (iconCode.includes("02")) return <CloudSun className="w-16 h-16 text-gray-500" />;
  if (iconCode.includes("03") || iconCode.includes("04")) return <Cloud className="w-16 h-16 text-gray-500" />;
  if (iconCode.includes("09") || iconCode.includes("10")) return <CloudRain className="w-16 h-16 text-blue-500" />;
  
  return <Sun className="w-16 h-16 text-yellow-500" />;
};

export async function WeatherCard() {
  const data = await getWeatherData();

  if (!data) {
    return (
      <Card>
        <CardHeader><CardTitle>Clima</CardTitle></CardHeader>
        <CardContent><p>Não foi possível carregar os dados do clima.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Clima em {data.city}</span>
          <span className="text-sm font-normal text-muted-foreground capitalize">
            {data.description}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-6">
          {getWeatherIcon(data.icon)}
          <div className="text-6xl font-bold">
            {Math.round(data.temp)}°C
          </div>
        </div>
        <div className="flex justify-around text-center">
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-blue-400"/>
            <div>
              <p className="font-semibold">{data.humidity}%</p>
              <p className="text-xs text-muted-foreground">Umidade</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-gray-400"/>
            <div>
              <p className="font-semibold">{data.wind_speed.toFixed(1)} m/s</p>
              <p className="text-xs text-muted-foreground">Vento</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}