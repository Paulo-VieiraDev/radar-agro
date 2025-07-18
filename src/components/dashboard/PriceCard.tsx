import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PriceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cotações</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Gráficos e preços das principais commodities...
        </p>
      </CardContent>
    </Card>
  );
}