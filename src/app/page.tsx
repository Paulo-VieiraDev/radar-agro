import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { PriceCard } from "@/components/dashboard/PriceCard";
import { NewsCard } from "@/components/dashboard/NewsCard";
import { Wheat } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="mb-8 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <Wheat className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold tracking-tight">
            Radar Agro
          </h1>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <PriceCard />
          <WeatherCard />
        </div>
        <div className="lg:col-span-2">
          <NewsCard />
        </div>
      </div>
    </main>
  );
}