import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function WeatherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clima</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Previsão do tempo para a sua região...
        </p>
      </CardContent>
    </Card>
  );
}