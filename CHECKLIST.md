# Project Milestone Checklist

Diese Checkliste ist entlang der definierten Meilensteine strukturiert und zeigt den aktuellen Stand der Umsetzung.

## Milestone 1: Project Setup & Architecture

- [x] Anforderungen und User Stories in PRD.md definiert
- [x] Monorepo-Struktur mit `backend/` und `frontend/` angelegt
- [x] Backend (Node.js/Express) initialisiert
- [x] Frontend (React) initialisiert
- [x] Versionierung, `.gitignore` und Projektstruktur dokumentiert
- [x] ESLint & Prettier installiert (Backend/Frontend)
- [x] GitHub Actions Workflow für Linting eingerichtet

## Milestone 2: Backend Core (API & Database)

- [x] MongoDB-Schema für Meals & Metadaten entwerfen
- [ ] REST API Endpunkte für CRUD-Operationen implementieren
- [ ] MongoDB-Anbindung und Datenmodelle integrieren

## Milestone 3: Scraping & AI Enrichment

- [ ] Scraping-Module für Zielseite entwickeln
- [ ] Speicherung der gescrapten Daten in MongoDB
- [ ] AI-Anreicherung (Kategorisierung, Tags, Popularität) integrieren
- [ ] Regelmäßige Scraping- und Enrichment-Jobs einrichten

## Milestone 4: Frontend Development (React, German UI)

- [ ] UI-Wireframes und User Flows (auf Deutsch) entwerfen
- [ ] Haupt-React-Komponenten (Menüliste, Detailansicht, Suche/Filter) implementieren
- [ ] Frontend mit Backend-API verbinden
- [ ] Lokalisierung und Barrierefreiheit ergänzen

## Milestone 5: Integration & Testing

- [ ] Unit- und Integrationstests für Backend und Frontend schreiben
- [ ] End-to-End-Tests für Scraping, Enrichment und UI-Flows durchführen
- [ ] User Acceptance Testing (UAT) mit deutschsprachigen Nutzern

## Milestone 6: Deployment & Monitoring

- [ ] Deployment-Pipelines (Docker, Cloud) einrichten
- [ ] Backend und Frontend produktiv deployen
- [ ] Monitoring, Logging und Error Reporting implementieren

---

**Hinweis:** Hake jeden Punkt ab, sobald er erledigt ist. Die Meilensteine und Aufgaben orientieren sich an der PRD und
den Issues.
