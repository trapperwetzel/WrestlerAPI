import express from 'express';
import Wrestler from '../models/wrestler.js';
import fetchWWEChampions from '../services/fetchWWEChampions.js';

const router = express.Router();



router.post('/', async (req, res) => {
    try {
        const wweChampionsData = await fetchWWEChampions();
        if (wweChampionsData.length === 0) {
            return res.status(404).json({ error: 'No WWE Champions data found' });
        }

        // Clear existing data
        await Wrestler.deleteMany({});

        // Insert new data
        const insertedWrestlers = await Wrestler.insertMany(wweChampionsData);
        res.status(201).json(insertedWrestlers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to insert WWE Champions data' });
    }
});


// Getting All
router.get('/', async (req, res) => {
  const wrestlers = await Wrestler.find().sort({ totalReigns: -1 });
  res.json(wrestlers);
});





export default router;