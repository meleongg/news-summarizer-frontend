# AI-Powered News Summarizer & Sentiment Analyzer 📰🤖

This project fetches news articles, summarizes them using NLP models, and analyzes sentiment. This is the Next.js and React.js frontend.

## Demo

- Fast API Hugging Face Space Demo: https://meleong-news-summarizer.hf.space/docs#/

## Features

- ✅ Fetch news via API
- ✅ Summarize using Hugging Face `bart-large-cnn`
- ✅ Analyze sentiment with NLTK
- ✅ Simple UI Next.js, React, and ShadCN components

## Local Testing

```bash
git clone https://github.com/meleongg/news-summarizer-backend.git
pip install -r requirements.txt
uvicorn main:app --reload
```

In a new terminal:

```bash
git clone https://github.com/meleongg/news-summarizer-frontend.git
touch .env # create a new variable called NEXT_PUBLIC_BACKEND_URL and set it to your localhost backend endpoint
npm run dev
```
