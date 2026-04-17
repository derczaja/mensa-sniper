require('dotenv').config();
const OpenAI = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');

//TODO: add tags to each meal
async function extractMealsWithOpenAI(htmlText) {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    const prompt = `Extrahiere aus folgendem Mensa-Speiseplan-Tabellentext die Gerichte als strukturierte JSON-Liste mit Feldern: date, name, kategorie (falls erkennbar), ort='Mensa Garching'. Beispiel: [{"date": "2026-04-17", "name": "Nudelauflauf italienische Art", "kategorie": "Vegetarisch", "ort": "Mensa Garching"}, ...]. Der Text stammt aus einer Tabelle und kann unvollständig sein.\n\nTabellentext:\n${htmlText}`;
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {role: 'system', content: 'Du bist ein hilfreicher Datenextraktor für Mensa-Speisepläne.'},
            {role: 'user', content: prompt}
        ],
        max_tokens: 1000,
        temperature: 0.2
    });
    // Extrahiere JSON aus der Antwort
    const content = response.choices[0].message.content;
    const match = content.match(/\[.*\]/s);
    if (match) {
        return JSON.parse(match[0]);
    }
    throw new Error('Keine strukturierte Liste gefunden!');
}

if (require.main === module && process.argv[2] === 'openai') {
    // Hole den HTML-Text der Mensa-Seite
    axios.get('https://www.studierendenwerk-muenchen-oberbayern.de/mensa/speiseplan/speiseplan_422_-de.html')
        .then(async res => {
            const $ = cheerio.load(res.data);
            let meals = [];
            $('.c-schedule__item').each((i, item) => {
                // Extract date from header
                const header = $(item).find('.c-schedule__header span').first().text();
                // Try to extract date in format DD.MM.YYYY
                let dateMatch = header.match(/(\d{2}\.\d{2}\.\d{4})/);
                let date = null;
                if (dateMatch) {
                    // Convert to YYYY-MM-DD
                    const [d, m, y] = dateMatch[1].split('.');
                    date = `${y}-${m}-${d}`;
                }
                // For each meal
                $(item).find('li.c-menu-dish-list__item').each((j, li) => {
                    const name = $(li).find('.c-menu-dish__title').text().trim();
                    let kategorie = $(li).find('.stwm-artname').text().trim();
                    // Normalize kategorie
                    if (/vegetarisch|fleischlos/i.test(kategorie)) {
                        kategorie = 'Vegetarisch';
                    }
                    // Replace commas with slashes
                    if (kategorie) {
                        kategorie = kategorie.replace(/\s*,\s*/g, ' / ');
                    }
                    // Remove parenthesis for Dessert (Glas) and similar
                    if (/^Dessert(\s*\(.*\))?$/i.test(kategorie)) {
                        kategorie = 'Dessert';
                    }
                    if (name) {
                        meals.push({
                            date: date || '',
                            name,
                            kategorie: kategorie || '',
                            ort: 'Mensa Garching'
                        });
                    }
                });
            });
            // If no meals found, fallback to OpenAI as before
            if (meals.length === 0) {
                const mealText = $('body').text().split('\n').slice(0, 30).join('\n');
                return extractMealsWithOpenAI(mealText).then(openaiMeals => {
                    // Normalize kategorie in OpenAI result
                    const normalizedMeals = openaiMeals.map(meal => {
                        let kategorie = meal.kategorie || '';
                        if (/vegetarisch|fleischlos/i.test(kategorie)) {
                            kategorie = 'Vegetarisch';
                        }
                        if (kategorie) {
                            kategorie = kategorie.replace(/\s*,\s*/g, ' / ');
                        }
                        if (/^Dessert(\s*\(.*\))?$/i.test(kategorie)) {
                            kategorie = 'Dessert';
                        }
                        return {...meal, kategorie};
                    });
                    console.log('OpenAI-extrahierte Gerichte:', normalizedMeals);
                });
            }
            // Just normalize and output meals as before, no tags
            const normalizedMeals = meals.map(meal => {
                let kategorie = meal.kategorie || '';
                if (/vegetarisch|fleischlos/i.test(kategorie)) {
                    kategorie = 'Vegetarisch';
                }
                if (kategorie) {
                    kategorie = kategorie.replace(/\s*,\s*/g, ' / ');
                }
                if (/^Dessert(\s*\(.*\))?$/i.test(kategorie)) {
                    kategorie = 'Dessert';
                }
                return {...meal, kategorie};
            });
            console.log('Direkt extrahierte Gerichte:', normalizedMeals);
            return normalizedMeals;
        })
        .then(meals => {
            if (meals && Array.isArray(meals)) {
                // Already normalized and tags included, just output
                console.log('Extrahierte Gerichte:', meals);
            }
        })
        .catch(err => {
            console.error('Gerichte-Extraktion fehlgeschlagen:', err.message);
        });
}


