// MongoDB schema for Meals & Metadata
const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    // price removed: no price should be specified
    category: {type: String}, // e.g. "Vegetarisch", "Vegan", "Fleisch"
    tags: [String],
    date: {type: Date, required: true},
    location: {type: String}, // Mensa-Standort
    meta: {
        scrapedAt: {type: Date, default: Date.now},
        sourceUrl: {type: String},
        popularity: {type: Number, default: 0},
        enriched: {type: Boolean, default: false}
    }
});

module.exports = mongoose.model('Meal', MealSchema);


