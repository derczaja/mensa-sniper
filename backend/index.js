require('dotenv').config();
// Basic Express server for mensa-sniper backend
const express = require('express');
const connectDB = require('./db');
const Meal = require('./meal.model');

const OpenAI = require('openai');
const cron = require('node-cron');
const {exec} = require('child_process');

const app = express();
app.use(express.json()); // Middleware for JSON parsing
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();
// Flattened meals endpoint for frontend
app.get('/api/meals', async (req, res) => {
    try {
        const meals = await Meal.find();
        // Flatten planned meals
        const flatMeals = [];
        meals.forEach(meal => {
            (meal.planned || []).forEach(plan => {
                flatMeals.push({
                    id: meal._id,
                    name: meal.name,
                    description: meal.description,
                    category: meal.category,
                    tags: meal.tags,
                    date: plan.date.toISOString().slice(0, 10),
                    location: plan.location
                });
            });
        });
        res.json(flatMeals);
    } catch (err) {
        res.status(500).json({error: 'Fehler beim Abrufen der Meals', details: err.message});
    }
});

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// AI-based meal similarity check
async function areMealsSameAI(mealA, mealB) {
    const prompt = `Vergleiche diese beiden Mensa-Gerichte und beantworte nur mit "true" (wenn sie das gleiche Gericht sind, auch bei kleinen Unterschieden) oder "false" (wenn sie unterschiedlich sind):\n\nGericht 1: ${JSON.stringify(mealA)}\nGericht 2: ${JSON.stringify(mealB)}`;
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {role: 'system', content: 'Du bist ein strenger Duplikatprüfer für Mensa-Gerichte.'},
            {role: 'user', content: prompt}
        ],
        max_tokens: 5,
        temperature: 0.0
    });
    const content = response.choices[0].message.content.trim().toLowerCase();
    return content.startsWith('true');
}

app.get('/', (req, res) => {
    res.send('Mensa-Sniper Backend läuft!'); // German output as required
});

// CRUD Endpunkte für Meals
// Alle Meals abrufen
app.get('/meals', async (req, res) => {
    try {
        const meals = await Meal.find();
        res.json(meals);
    } catch {
        res.status(500).json({error: 'Fehler beim Abrufen der Meals'});
    }
});

// Einzelnes Meal abrufen
app.get('/meals/:id', async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) return res.status(404).json({error: 'Meal nicht gefunden'});
        res.json(meal);
    } catch {
        res.status(500).json({error: 'Fehler beim Abrufen des Meals'});
    }
});

// Neues Meal anlegen
app.post('/meals', async (req, res) => {
    try {
        const meal = new Meal(req.body);
        await meal.save();
        res.status(201).json(meal);
    } catch (err) {
        res.status(400).json({error: 'Fehler beim Anlegen des Meals', details: err.message});
    }
});

// Meal aktualisieren
app.put('/meals/:id', async (req, res) => {
    try {
        const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!meal) return res.status(404).json({error: 'Meal nicht gefunden'});
        res.json(meal);
    } catch (err) {
        res.status(400).json({error: 'Fehler beim Aktualisieren des Meals', details: err.message});
    }
});

// Meal löschen
app.delete('/meals/:id', async (req, res) => {
    try {
        const meal = await Meal.findByIdAndDelete(req.params.id);
        if (!meal) return res.status(404).json({error: 'Meal nicht gefunden'});
        res.json({message: 'Meal gelöscht'});
    } catch {
        res.status(500).json({error: 'Fehler beim Löschen des Meals'});
    }
});

// Bulk insert or update meals with AI deduplication
app.post('/meals/bulk', async (req, res) => {
    const meals = req.body;
    if (!Array.isArray(meals)) {
        return res.status(400).json({error: 'Request body must be an array of meals'});
    }
    try {
        // Fetch all existing meals (optimization possible, but fetch all for now)
        const allExistingMeals = await Meal.find();
        let processed = [];
        for (const meal of meals) {
            // meal should have: name, description, category, tags, planned (array of {date, location}), meta
            let found = false;
            for (const existing of allExistingMeals) {
                // Use AI to check if meals are the same (ignore planned field in comparison)
                const mealForAI = {...meal};
                const existingForAI = {...existing.toObject()};
                delete mealForAI.planned;
                delete existingForAI.planned;
                if (await areMealsSameAI(mealForAI, existingForAI)) {
                    // Merge planned arrays, avoiding duplicates
                    const newPlanned = meal.planned || [];
                    await Meal.updateOne(
                        {_id: existing._id},
                        {$addToSet: {'planned': {$each: newPlanned}}, $set: {meta: meal.meta || {}}}
                    );
                    found = true;
                    break;
                }
            }
            if (!found) {
                // Insert as new meal
                const newMeal = new Meal(meal);
                await newMeal.save();
            }
            processed.push({name: meal.name, planned: meal.planned, matched: found});
        }
        res.status(200).json({message: 'Meals processed with AI deduplication', processed});
    } catch (err) {
        res.status(500).json({error: 'Bulk operation failed', details: err.message});
    }
});


// Schedule scraping job daily at 6:00 AM
cron.schedule('0 6 * * *', () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Starting scheduled scraping job...`);
    exec('node backend/scraping.js openai', (error, stdout, stderr) => {
        if (error) {
            console.error(`[${timestamp}] Scraping job failed:`, error.message);
            return;
        }
        if (stderr) {
            console.error(`[${timestamp}] Scraping job stderr:`, stderr);
        }
        console.log(`[${timestamp}] Scraping job output:`, stdout);
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
