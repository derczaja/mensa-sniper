// Basic Express server for mensa-sniper backend
const express = require('express');
const connectDB = require('./db');
const Meal = require('./meal.model');

const app = express();
app.use(express.json()); // Middleware for JSON parsing
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();


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

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
