// src/components/dashboard/NewsCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { NewsArticle } from "@/app/api/news/route";
import { Newspaper } from "lucide-react";

async function getNewsData(): Promise<NewsArticle[] | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/news`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) return null;

    return response.json();
  } catch (error) {
    console.error("Falha ao buscar notícias no componente:", error);
    return null;
  }
}

export async function NewsCard() {
  const articles = await getNewsData();

  return (
    <Card className="sm:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Últimas Notícias
        </CardTitle>
      </CardHeader>
      <CardContent>
        {articles && articles.length > 0 ? (
          <ul className="space-y-3">
            {articles.map((article, index) => (
              <li key={index}>
                <a 
                  href={article.link}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base font-medium text-gray-800 hover:text-primary hover:underline transition-colors"
                >
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar as notícias no momento.
          </p>
        )}
      </CardContent>
    </Card>
  );
}