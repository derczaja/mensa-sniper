# mensa-sniper

A lightweight web application that fetches, structures, and enriches meal plans from the Studierendenwerk München
Oberbayern. The app automatically scrapes unstructured meal data from the public website, uses AI to assign categories (
e.g., vegan, vegetarian, meat), generate descriptive tags, and calculate a simple popularity score for each dish. All
results are cached in MongoDB for efficiency.

The backend is built with Node.js and Express, providing a minimal REST API. The frontend is a minimal React app focused
on clarity and usability, displaying all information in German. The system avoids unnecessary complexity and prioritizes
performance and simplicity over feature richness.

**Pipeline:** Website → Scraper → AI → Database → API → Frontend
