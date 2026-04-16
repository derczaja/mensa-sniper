# Product Requirements Document (PRD)

## Project Overview

This project aims to build a simple yet effective web application that enables users to quickly see what meals are
available in their university cafeteria (Mensa) over the coming days. The application transforms unstructured meal plan
data from a public website into a clean, structured, and user-friendly experience. Instead of requiring users to
manually scan a cluttered webpage, the app automatically fetches, processes, and presents the data in a minimal,
readable interface.

**Important Note:** The entire application (backend and frontend) as well as all user interfaces and data presentation
must be fully in German.

## Key Features

- **Automated Data Aggregation:** Scrapes meal plans from a public Mensa website and structures the data.
- **AI-Powered Enrichment:** Each meal is analyzed once using AI to:
    - Determine its category (e.g., vegan, vegetarian, meat)
    - Generate descriptive tags
    - Assign a simple popularity score
- **Caching and Efficiency:** Results from AI enrichment are cached in MongoDB to avoid redundant processing and
  minimize costs.
- **Backend:**
    - Built with Node.js and Express
    - Handles scraping, data processing, and storage
    - Exposes a minimal REST API for the frontend
- **Frontend:**
    - Lightweight React web application
    - Fetches and displays meal data in a clean, minimalistic layout
    - Focuses on readability and ease of navigation
- **Simplicity:**
    - No authentication or heavy features
    - Performance and clarity are prioritized over feature richness
- **Language:**
    - All content, labels, error messages, and data are displayed in German.

## System Architecture

```
Website → Scraper → AI → Database → API → Frontend (all in German)
```

## Most Important Facts

- The application aggregates and structures Mensa meal plans from a public website.
- It uses AI to enrich meals with categories, tags, and a popularity score.
- Data is stored in MongoDB to avoid repeated processing and API calls.
- The backend is built with Node.js and Express, including a scraper and REST API.
- The frontend is a minimal React web app focused on clarity and usability.
- The system avoids unnecessary complexity (no authentication, no heavy features).
- Performance and simplicity are prioritized over feature richness.
- The entire pipeline is: Website → Scraper → AI → Database → API → Frontend (all in German).
- The application is fully designed for German language output.
