"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface Article {
  title: string;
  url: string;
  source: string;
}

interface AnalysisResult {
  title: string;
  sentiment: string;
  summary: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevancy");
  const [pageSize, setPageSize] = useState(10);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const fetchNews = async () => {
    setLoading(true);
    setArticles([]);
    setSelectedArticle(null);
    setAnalysisResult(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/fetch_news/?query=${query}&sort_by=${sortBy}&page_size=${pageSize}`
      );
      if (!response.ok) throw new Error("Failed to fetch news.");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeArticle = async () => {
    if (!selectedArticle) return;
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/analyze/?url=${selectedArticle.url}`
      );
      if (!response.ok) throw new Error("Failed to analyze article.");
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        AI News Summarizer & Sentiment Analyzer 📰🤖
      </h1>

      {/* Query Input */}
      <Input
        type="text"
        placeholder="Enter a topic or keyword..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Sorting and Page Size Dropdowns */}
      <div className="flex gap-4">
        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevancy">Relevancy</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="publishedAt">Publish Date</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setPageSize(Number(value))}
          value={pageSize.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Articles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fetch News Button */}
      <Button onClick={fetchNews} disabled={loading}>
        {loading ? <Loader2 className="animate-spin mr-2" /> : "Search News"}
      </Button>

      {/* Articles List */}
      {articles.length > 0 && (
        <Select
          onValueChange={(value) =>
            setSelectedArticle(articles.find((a) => a.title === value) || null)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose an article" />
          </SelectTrigger>
          <SelectContent>
            {articles.map((article) => (
              <SelectItem key={article.url} value={article.title}>
                {article.title} ({article.source})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Selected Article */}
      {selectedArticle && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedArticle.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Source: {selectedArticle.source}</p>
            <a
              href={selectedArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Read full article
            </a>
          </CardContent>
        </Card>
      )}

      {/* Analyze Button */}
      {selectedArticle && (
        <Button onClick={analyzeArticle} disabled={analyzing}>
          {analyzing ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            "Analyze Article"
          )}
        </Button>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold">{analysisResult.title}</h2>
            <p>
              <span className="font-bold">Sentiment: </span>
              {analysisResult.sentiment === "positive" ? (
                <span className="text-green-500">😊 Positive</span>
              ) : analysisResult.sentiment === "neutral" ? (
                <span className="text-gray-500">😐 Neutral</span>
              ) : (
                <span className="text-red-500">😢 Negative</span>
              )}
            </p>
            <h3 className="font-semibold mt-2">Summary:</h3>
            <p>{analysisResult.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
