import express from 'express';
import pool from '../database/db.js';

const router = express.Router();

/**
 * GET /api/wrestlers
 *
 * Return a list of wrestlers with aggregated championship statistics.
 * Data is loaded from the PostgreSQL database instead of being re-built
 * on every request. See scripts/loadDataToDb.js for the import routine.
 */
router.get('/', async (req, res) => {
  try {
    // fetch all wrestlers
    const { rows: wrestlerRows } = await pool.query(
      'SELECT id, name, total_reigns_all AS "totalReignsAll", total_days_all AS "totalDaysAll" FROM wrestlers ORDER BY total_days_all DESC'
    );

    // fetch all championship records
    const { rows: championshipRows } = await pool.query(
      'SELECT wrestler_id, championship_name AS "championshipName", total_reigns AS "totalReigns", total_days_held AS "totalDaysHeld" FROM wrestler_championships'
    );

    // group championship records by wrestler_id for efficient lookup
    const champsByWrestler = {};
    for (const ch of championshipRows) {
      if (!champsByWrestler[ch.wrestler_id]) {
        champsByWrestler[ch.wrestler_id] = [];
      }
      champsByWrestler[ch.wrestler_id].push({
        championshipName: ch.championshipName,
        totalReigns: ch.totalReigns,
        totalDaysHeld: ch.totalDaysHeld,
      });
    }

    // build the response array
    const data = wrestlerRows.map((w) => ({
      name: w.name,
      totalReignsAll: w.totalReignsAll,
      totalDaysAll: w.totalDaysAll,
      championships: champsByWrestler[w.id] || [],
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch wrestlers from database' });
  }
});

export default router;

