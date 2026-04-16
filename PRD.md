# Product Requirements Document (PRD)

## Project Overview

This project aims to build a simple yet effective web application (accessed via browser, not a native or mobile app)
that enables users to quickly see what meals are available in their university cafeteria (Mensa) over the coming days.
The application transforms unstructured meal plan data from a public website into a clean, structured, and user-friendly
experience. Instead of requiring users to manually scan a cluttered webpage, the app automatically fetches, processes,
and presents the data in a minimal, readable interface.

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
    - Lightweight React web application (browser-based)
    - Fetches and displays meal data in a clean, minimalistic layout
    - Focuses on readability and ease of navigation
- **Simplicity:**
    - No authentication or heavy features
    - Performance and clarity are prioritized over feature richness
- **Language:**
    - All content, labels, error messages, and data are displayed in German.

## System Architecture

```
Website → Scraper → AI → Database → API → Frontend (all in German, browser-based web app)
```

## Project Milestones and Tasks

The project is structured into the following milestones, each with a set of concrete tasks:

### Milestone 1: Project Setup & Architecture

- Define requirements and user stories in PRD.md
- Set up monorepo structure for backend and frontend
- Initialize backend (Node.js/Express) project
- Initialize frontend (React) project
- Configure version control, code style, and CI/CD

### Milestone 2: Backend Core (API & Database)

- Design MongoDB schema for meals and metadata
- Implement REST API endpoints for CRUD operations
- Integrate MongoDB connection and data models

### Milestone 3: Scraping & AI Enrichment

- Develop scraping modules for the target mensa website
- Store scraped data in MongoDB via backend API
- Integrate AI enrichment (dish categorization, tag generation, popularity scoring)
- Schedule regular scraping and enrichment jobs

### Milestone 4: Frontend Development (React, German UI)

- Design UI wireframes and user flows (in German)
- Implement main React components: menu list, detail view, search/filter
- Connect frontend to backend REST API
- Add localization and accessibility features

### Milestone 5: Integration & Testing

- Write unit and integration tests for backend and frontend
- Perform end-to-end testing of scraping, enrichment, and UI flows
- Conduct user acceptance testing (UAT) with German-speaking users

### Milestone 6: Deployment & Monitoring

- Set up deployment pipelines (Docker, cloud hosting)
- Deploy backend and frontend to production
- Implement monitoring, logging, and error reporting

## Most Important Facts

- The application aggregates and structures Mensa meal plans from a public website.
- It uses AI to enrich meals with categories, tags, and a popularity score.
- Data is stored in MongoDB to avoid repeated processing and API calls.
- The backend is built with Node.js and Express, including a scraper and REST API.
- The frontend is a minimal React web app focused on clarity and usability, accessed via browser.
- The system avoids unnecessary complexity (no authentication, no heavy features).
- Performance and simplicity are prioritized over feature richness.
- The entire pipeline is: Website → Scraper → AI → Database → API → Frontend (all in German, browser-based web app).
- The application is fully designed for German language output and browser-based usage.
