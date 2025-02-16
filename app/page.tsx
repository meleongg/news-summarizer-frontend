"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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

// Add this helper function at the top of your component
const sanitizeQuery = (input: string): string => {
  // Expanded regex to include hyphens and question marks
  const hasSpecialChars = /[-!?@#$%^&*(),.":{}|<>]/.test(input);

  // If special characters are found and the input isn't already quoted
  if (hasSpecialChars && !input.startsWith('"') && !input.endsWith('"')) {
    // Handle existing quotes within the text
    const sanitizedInput = input.replace(/"/g, '\\"');
    return `"${sanitizedInput}"`;
  }

  return input;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevancy");
  const [pageSize, setPageSize] = useState(5);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    setArticles([]);
    setSelectedArticle(null);
    setAnalysisResult(null);

    try {
      const sanitizedQuery = sanitizeQuery(query.trim());
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/fetch_news/?query=${encodeURIComponent(
          sanitizedQuery
        )}&sort_by=${sortBy}&page_size=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        }
      );
      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? "Too many requests. Please try again later."
            : "Failed to fetch news. Please try again."
        );
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const analyzeArticle = async () => {
    if (!selectedArticle) return;
    setAnalyzing(true);
    setAnalysisResult(null);
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/analyze/?url=${selectedArticle.url}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        }
      );
      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? "Too many analysis requests. Please try again later."
            : response.status === 404
            ? "Could not access the article content. Please try another article."
            : "Failed to analyze article. Please try again."
        );
      }
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to analyze article"
      );
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6">
      <Alert>
        <AlertDescription>
          <strong>Note:</strong> Article analysis may take up to a minute to
          process, especially during periods of low activity. Please be patient
          while we fetch and analyze the latest news.
        </AlertDescription>
      </Alert>
      <h1 className="text-2xl font-bold text-center">
        AI News Summarizer & Sentiment Analyzer 📰🤖
      </h1>

      {/* Query Input */}
      <label className="block text-sm font-medium">
        Enter a topic or keyword to search news articles
        <span className="text-red-500">*</span>
      </label>
      <Input
        type="text"
        placeholder="Enter a topic or keyword..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
        className={`${!query.trim() && "border-red-500"}`}
      />
      {!query.trim() && (
        <p className="text-red-500 text-sm">Please enter a search term</p>
      )}

      {/* Sorting and Page Size Dropdowns */}
      <div className="flex gap-4 mt-2">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Sort Results By
          </label>
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
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Number of Articles
          </label>
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
      </div>

      {/* Fetch News Button */}
      <Button
        onClick={fetchNews}
        disabled={loading || !query.trim()}
        className="w-30"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin h-5 w-5" />
          </div>
        ) : (
          "Search News"
        )}
      </Button>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </AlertDescription>
        </Alert>
      )}

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
        <Button onClick={analyzeArticle} disabled={analyzing} className="w-30">
          {analyzing ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-5 w-5" />
            </div>
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

      <footer className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} AI News Summarizer. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
