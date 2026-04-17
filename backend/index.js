// Basic Express server for mensa-sniper backend
const express = require('express');
const connectDB = require('./db');
const Meal = require('./meal.model');
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('Mensa-Sniper Backend läuft!'); // German output as required
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
