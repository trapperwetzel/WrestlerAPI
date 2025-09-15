const { Pool } = require('pg');
const pool = new Pool({
    database: wrestlerDB,
})

export default pool; 