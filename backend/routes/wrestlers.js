import express from 'express';
import mergeChampionsData from '../fetches/mergeChampionsData.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const data = await mergeChampionsData();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch merged champions data' });
  }
});

export default router;
