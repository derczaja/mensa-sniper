# Monorepo Structure

This project uses a monorepo structure to manage both backend and frontend codebases:

- `backend/` – Node.js/Express backend (scraping, API, database)
- `frontend/` – React frontend (browser-based, German UI)

See each subdirectory for details. All requirements and architecture are in PRD.md.

# mensa-sniper

A lightweight web application (browser-based, not a native or mobile app) that fetches, structures, and enriches meal
plans from the Studierendenwerk München Oberbayern. The app automatically scrapes unstructured meal data from the public
website, uses AI to assign categories (e.g., vegan, vegetarian, meat), generate descriptive tags, and calculate a simple
popularity score for each dish. All results are cached in MongoDB for efficiency.

The backend is built with Node.js and Express, providing a minimal REST API. The frontend is a minimal React app focused
on clarity and usability, displaying all information in German and accessible via browser. The system avoids unnecessary
complexity and prioritizes performance and simplicity over feature richness.

**Pipeline:** Website → Scraper → AI → Database → API → Frontend (browser-based)
