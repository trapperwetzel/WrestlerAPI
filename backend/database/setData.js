import pool from './db.js';
import buildDataset from "./buildData.js";
import format from 'pg-format';
/*
 * @buildDataset(): this returns an array of Wrestler Objects. Each object entry contains a name for the wrestler, an array of championships.
 * Wrestler Object: {
 *  name: "CM Punk",
 *  Championships: [Championship]
 * }
 * Championship Object: {
 *  championshipName: "AEW Championship",
 *  totalReigns: 2,
 *  totalDaysHeld: 90
 * }
 * @data: This is our data object containing our array of wrestler objects. 
 * 
 *
*/
const data = buildDataset();
const values = data.map(wrestler => [
  wrestler.name,
  wrestler.championships || []
])
const dbQuery = format('INSERT INTO wrestlers(name,championships) VALUES %L ON CONFLICT (name) DO UPDATE SET championships = EXCLUDED.championships WHERE wrestlers.championships IS DISTINCT FROM EXCLUDED.championships', values);
const results = await pool.query(dbQuery)
export async function setData() {

  console.log(result.rows);
  return result.rows
}




