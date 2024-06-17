const API_KEY = '183daca270264bad86fc5b72972fb82a';
const BASE_URL = 'https://newsapi.org/v2/everything';

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export const getNews = async (query: string): Promise<Article[]> => {
  try {
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.articles;
  } catch (error) {
    throw error;
  }
};
