# AI-Powered News Summarizer & Sentiment Analyzer 📰🤖

This project fetches news articles, summarizes them using NLP models, and analyzes sentiment. This is the Next.js and React.js frontend.

## Demo

https://news-summarizer-frontend.vercel.app/

<img width="1008" alt="image" src="https://github.com/user-attachments/assets/b7cc0d32-e201-4249-a0df-f354c0d114dd" />

## Features

- ✅ Fetch news via GNewsAPI
- ✅ Summarize using Hugging Face `bart-large-cnn` via Inference API
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

## Deployment Challenges & Solutions

### Memory Constraints

- Large NLP models (BART-CNN) requires significant memory
- Free-tier hosting services (Heroku, Railway) insufficient for model deployment
- Most providers limit memory to 512MB-1GB

### API Constraints

- NewsAPI blocks non-local origin requests for their Free Tier
