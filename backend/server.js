import express from 'express';
import cors from 'cors';

import wrestlerRouter from './routes/wrestlers.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// base route for wrestlers
app.use('/api/wrestlers', wrestlerRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
