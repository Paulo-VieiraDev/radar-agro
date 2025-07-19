# Radar Agro 🛰️🌾

Um dashboard dinâmico e responsivo focado no agronegócio brasileiro, fornecendo dados em tempo real sobre cotações, clima e notícias. Este projeto foi construído com Next.js e utiliza técnicas de web scraping para agregar informações de fontes públicas em uma interface limpa, moderna e profissional.

## ➤ Principais Funcionalidades

O dashboard é composto por três cards principais, cada um com funcionalidades ricas e interativas:

#### 📊 Card de Cotações
- **Filtro Interativo:** Permite ao usuário selecionar e visualizar em tempo real a cotação de múltiplas commodities (Soja, Milho, Café, Trigo).
- **Variação Diária:** Exibe a variação percentual do dia com cores e ícones (▲ verde para alta, ▼ vermelho para baixa), fornecendo um feedback visual instantâneo sobre o mercado.
- **Gráfico de Histórico:** Apresenta um gráfico de linha com o histórico de preços dos últimos ~15 dias, utilizando a biblioteca Recharts para uma visualização de dados elegante.
- **Unidades Claras:** Mostra o preço e a unidade correspondente (ex: "por saca de 60kg", "por tonelada") para evitar ambiguidades.

#### ☀️ Card de Clima
- **Seletor de Cidade Manual:** Qualquer usuário pode alterar a cidade para a qual deseja ver a previsão do tempo através de um diálogo simples.
- **Gráfico de Previsão Horária:** Um gráfico de área exibe a previsão de temperatura para as próximas 24 horas, preenchendo o espaço do card de forma útil e bonita.
- **Previsão para 7 Dias:** Na parte inferior do card, uma previsão concisa para a semana inteira é exibida, com dia da semana, ícone do tempo e temperaturas máxima e mínima.
- **API Confiável:** Utiliza a API gratuita e sem chave do Open-Meteo para garantir alta disponibilidade e velocidade dos dados.

#### 📰 Card de Notícias
- **Layout Profissional:** Exibe as 6 notícias mais recentes em um layout de grid responsivo (3x2 no desktop, 2x3 em tablets, 1x6 em celulares), inspirado em portais de notícias modernos.
- **Conteúdo Rico:** O scraper busca o título, o link, a imagem principal e a tag de categoria de cada notícia.
- **Design "Mobile-First":** As tags de categoria são ocultadas e os títulos diminuem em telas menores para garantir uma experiência de leitura limpa e sem sobrecarga de informação.

## 🚀 Stack Tecnológica

O projeto foi construído com um conjunto de tecnologias modernas e robustas, focando em performance, tipagem segura e uma ótima experiência de desenvolvimento.

- **Framework:** **Next.js 14+** (com App Router)
- **Linguagem:** **TypeScript**
- **Estilização:** **Tailwind CSS**
- **Componentes UI:** **shadcn/ui**
- **Gráficos:** **Recharts**
- **Backend (API Routes):**
  - **Web Scraping:** **Puppeteer** (para robustez) + **Cheerio** (para análise de HTML)
  - **Fontes de Dados:** CEPEA/ESALQ/USP (Cotações), Notícias Agrícolas (Notícias), Open-Meteo (Clima).

## 🏁 Como Começar

Siga os passos abaixo para executar o projeto localmente.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Paulo-VieiraDev/radar-agro.git
    cd radar-agro
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Variáveis de Ambiente:**
    Este projeto foi refatorado para não necessitar de chaves de API em um arquivo `.env`. Todas as fontes de dados são públicas.

4.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 🏗️ Estrutura do Projeto

A estrutura de pastas segue as convenções do Next.js App Router:
```
/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── news/
│   │   │   │   └── route.ts
│   │   │   ├── prices/
│   │   │   │   └── route.ts 
│   │   │   └── weather/
│   │   │       └── route.ts  
│   │   ├── page.tsx            
│   │   └── layout.tsx           
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── PriceCard.tsx
│   │   │   └── WeatherCard.tsx
│   │   └── ui/                
│   └── lib/
│       └── utils.ts          
├── next.config.ts
└── ...
```
