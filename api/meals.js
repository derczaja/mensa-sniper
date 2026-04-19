// Vercel Serverless Function: /api/meals.js
// Holt alle Meals aus MongoDB Atlas

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

const MealSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    category: {type: String},
    tags: [String],
    planned: [
        {
            date: {type: Date, required: true},
            location: {type: String, required: true}
        }
    ],
    meta: {
        scrapedAt: {type: Date, default: Date.now},
        sourceUrl: {type: String},
        enriched: {type: Boolean, default: false}
    }
});

const Meal = mongoose.models.Meal || mongoose.model('Meal', MealSchema);

async function dbConnect() {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports = async (req, res) => {
    await dbConnect();
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
    res.status(200).json({debug: flatMeals.slice(0, 5), meals: flatMeals});
};

