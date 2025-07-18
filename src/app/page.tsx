// src/app/page.tsx
import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { PriceCard } from "@/components/dashboard/PriceCard";
import { NewsCard } from "@/components/dashboard/NewsCard";

export default function DashboardPage() {
  return (
    <main className="flex flex-col min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          Radar Agro
        </h1>
        <p className="text-muted-foreground">
          Seu painel de controle para o agronegócio.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <PriceCard />
        <NewsCard />
        <WeatherCard />
      </div>
    </main>
  );
}