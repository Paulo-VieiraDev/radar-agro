// src/components/dashboard/PriceCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import type { PriceData } from "@/app/api/prices/route";
import { TrendingUp } from "lucide-react";

async function getPriceData(): Promise<PriceData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/prices`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) return null;
    
    return response.json();
  } catch (error) {
    console.error("Falha ao buscar dados de cotação no componente:", error);
    return null;
  }
}

export async function PriceCard() {
  const data = await getPriceData();

  if (!data) {
    return (
      <Card>
        <CardHeader><CardTitle>Cotações</CardTitle></CardHeader>
        <CardContent><p>Não foi possível carregar os dados de cotação.</p></CardContent>
      </Card>
    );
  }

  const brlFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Cotação da {data.commodity}</span>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-4xl font-bold">
          {brlFormatter.format(data.priceBRL)}
        </div>
        <div className="text-lg text-muted-foreground">
          {usdFormatter.format(data.priceUSD)}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Última atualização: {data.lastUpdate} (Fonte: CEPEA)
        </p>
      </CardFooter>
    </Card>
  );
}