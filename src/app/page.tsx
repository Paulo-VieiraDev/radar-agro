import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { PriceCard } from "@/components/dashboard/PriceCard";
import { NewsCard } from "@/components/dashboard/NewsCard";
import AuthButton from "@/components/AuthButton";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Wheat } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  let userPreferredCity: string | null = null;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferredCity: true }
    });
    userPreferredCity = user?.preferredCity || null;
  }

  return (
    <main className="min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Wheat className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Radar Agro
          </h1>
        </div>
        <AuthButton />
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <PriceCard />
          <WeatherCard initialCity={userPreferredCity} />
        </div>
        <div className="lg:col-span-2">
          <NewsCard />
        </div>
      </div>
    </main>
  );
}