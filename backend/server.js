import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import wrestlerRouter from './routes/wrestlers.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log(" Connected to MongoDB"));

app.use(express.json());
app.use(cors());



app.use('/api/wrestlers', wrestlerRouter);

app.listen(PORT, () => console.log(` Server started on http://localhost:${PORT}`));