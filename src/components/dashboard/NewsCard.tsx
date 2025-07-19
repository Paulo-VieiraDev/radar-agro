'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Newspaper } from "lucide-react";
import Image from 'next/image';

interface NewsArticle {
  title: string;
  link: string;
  imageUrl: string | null;
  tag: string | null;
}

const NewsTag = ({ tag }: { tag: string | null }) => {
  if (!tag) return null;
  return (
    <div className="absolute top-2 right-2 bg-white text-xs font-semibold px-2 py-1 rounded z-10 shadow-md">
      {tag}
    </div>
  );
};

const NewsItem = ({ article, isLarge = false }: { article: NewsArticle, isLarge?: boolean }) => (
  <a href={article.link} target="_blank" rel="noopener noreferrer" 
     className="relative block w-full h-full group rounded-lg overflow-hidden shadow-md">
    {article.imageUrl ? (
      <Image 
        src={article.imageUrl} 
        alt={article.title} 
        fill 
        className="object-cover group-hover:scale-105 transition-transform duration-300" 
      />
    ) : (
      <div className="bg-slate-200 dark:bg-slate-800 h-full flex items-center justify-center p-2">
        <span className="text-slate-500 text-center text-sm">{article.title}</span>
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    <div className="absolute bottom-0 p-3 text-white">
      <h3 className={isLarge ? "text-lg font-bold group-hover:underline" : "text-sm font-semibold group-hover:underline"}>
        {article.title}
      </h3>
    </div>
    <NewsTag tag={article.tag} />
  </a>
);

export function NewsCard() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/news', { cache: 'no-store' });
        if (!response.ok) throw new Error('Falha ao buscar notícias');
        const data: NewsArticle[] = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Falha ao buscar notícias no componente:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const topArticles = articles.slice(0, 2);
  const bottomArticles = articles.slice(2, 6);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Últimas Notícias
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col h-full gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow min-h-[200px]">
              {topArticles.map((article, index) => (
                <NewsItem key={index} article={article} isLarge={true} />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-[180px]">
              {bottomArticles.map((article, index) => (
                <NewsItem key={index} article={article} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}