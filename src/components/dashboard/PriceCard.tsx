'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PriceData } from "@/app/api/prices/route";
import { Loader2, Leaf, Wheat, Coffee, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const commodities = [
  { value: 'soja', label: 'Soja' }, { value: 'milho', label: 'Milho' },
  { value: 'cafe', label: 'Café' }, { value: 'trigo', label: 'Trigo' },
];

const getCommodityIcon = (commodityValue: string) => {
  switch (commodityValue) {
    case 'soja': return <Leaf className="w-5 h-5 text-green-700" />;
    case 'milho': return <Wheat className="w-5 h-5 text-yellow-600" />;
    case 'cafe': return <Coffee className="w-5 h-5 text-amber-800" />;
    case 'trigo': return <Wheat className="w-5 h-5 text-amber-500" />;
    default: return null;
  }
};

export function PriceCard() {
  const [selectedCommodity, setSelectedCommodity] = useState('soja');
  const [data, setData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/prices?commodity=${selectedCommodity}`);
        if (!response.ok) throw new Error('Falha ao buscar dados');
        const priceData: PriceData = await response.json();
        setData(priceData);
      } catch (error) { console.error("Falha na cotação:", error); setData(null); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [selectedCommodity]);

  const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const renderDailyChange = (change: number) => {
    if (typeof change !== 'number' || isNaN(change)) return null;
    const isPositive = change > 0, isNegative = change < 0, isZero = change === 0;
    const formattedChange = `${isPositive ? '+' : ''}${change.toFixed(2).replace('.', ',')}%`;
    return (
      <Badge className={cn("text-sm", isPositive && "bg-green-100 text-green-800", isNegative && "bg-red-100 text-red-800", isZero && "bg-gray-100 text-gray-800")}>
        {isPositive && <ArrowUp className="h-4 w-4 mr-1" />}
        {isNegative && <ArrowDown className="h-4 w-4 mr-1" />}
        {isZero && <Minus className="h-4 w-4 mr-1" />}
        {formattedChange}
      </Badge>
    );
  };

  return (
    <Card className="shadow-sm flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getCommodityIcon(selectedCommodity)}
            <span>Cotação {data?.preposition || 'da'} {data?.commodity || '...'}</span>
          </div>
          <Select value={selectedCommodity} onValueChange={setSelectedCommodity} disabled={isLoading}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {commodities.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-start flex-grow">
        {isLoading ? <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
        : data ? (
          <div className="flex flex-col h-full">
            <div className="space-y-1">
              <div className="flex items-baseline gap-4">
                <div>
                  <div className="text-4xl font-bold">{brlFormatter.format(data.priceBRL)}</div>
                  <div className="text-sm text-muted-foreground -mt-1">{data.unit}</div>
                </div>
                {renderDailyChange(data.dailyChange)}
              </div>
            </div>
            <div className="flex-grow w-full mt-4 min-h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.history} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} dot={false} />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                  <Tooltip 
                    formatter={(value: number) => [brlFormatter.format(value), 'Preço']}
                    labelStyle={{ fontSize: 12 }}
                    contentStyle={{ fontSize: 14, border: 'none', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : <p className="text-destructive">Erro ao carregar dados.</p>}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-3">
        <span>{data ? `Atualizado: ${data.lastUpdate}` : ''}</span>
        <span className="font-semibold">{data ? `$${data.priceUSD.toFixed(2)} / US$` : ''}</span>
      </CardFooter>
    </Card>
  );
}