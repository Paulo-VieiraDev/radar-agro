import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function NewsCard() {
  return (
    <Card className="sm:col-span-2">
      <CardHeader>
        <CardTitle>Últimas Notícias</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Feed com as notícias mais recentes do setor...
        </p>
      </CardContent>
    </Card>
  );
}