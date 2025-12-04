import pool from '../database/db.js';
import mergeChampionsData from '../fetches/mergeChampionsData.js';

/**
 * This script populates the PostgreSQL database with the latest
 * wrestling data produced by mergeChampionsData().  Run this script
 * whenever you wish to refresh the database, for example:
 *
 *   node backend/scripts/loadDataToDb.js
 *
 * Connection details are managed via the database/db.js module.
 */

const createTables = async () => {
  // create wrestlers table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wrestlers (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      total_reigns_all INTEGER NOT NULL,
      total_days_all INTEGER NOT NULL
    )
  `);

  // create championships table for many-to-one relationship
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wrestler_championships (
      id SERIAL PRIMARY KEY,
      wrestler_id INTEGER NOT NULL REFERENCES wrestlers(id) ON DELETE CASCADE,
      championship_name TEXT NOT NULL,
      total_reigns INTEGER NOT NULL,
      total_days_held INTEGER NOT NULL
    )
  `);

  // optional: clear existing data before loading new dataset
  await pool.query('TRUNCATE wrestler_championships RESTART IDENTITY');
  await pool.query('TRUNCATE wrestlers RESTART IDENTITY CASCADE');
};

const loadData = async () => {
  const wrestlers = await mergeChampionsData();
  await createTables();

  for (const w of wrestlers) {
    // insert wrestler
    const { rows } = await pool.query(
      `INSERT INTO wrestlers (name, total_reigns_all, total_days_all)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [w.name, w.totalReignsAll, w.totalDaysAll]
    );
    const wrestlerId = rows[0].id;

    // insert each championship row
    for (const ch of w.championships) {
      await pool.query(
        `INSERT INTO wrestler_championships
         (wrestler_id, championship_name, total_reigns, total_days_held)
         VALUES ($1, $2, $3, $4)`,
        [wrestlerId, ch.championshipName, ch.totalReigns, ch.totalDaysHeld]
      );
    }
  }

  console.log(`Loaded ${wrestlers.length} wrestlers into the database`);
};

loadData()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await pool.end();
  });
