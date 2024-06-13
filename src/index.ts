import 'dotenv/config';
import express from 'express';
import connectDB from './db';
import globalRouter from './global-router';
import { logger } from './logger';
import { analyzeChanges } from './scrapper/scraper';
import cron from 'node-cron';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(logger);
app.use(express.json());
app.use('/api/', globalRouter);

app.get('/', (req, res) => {
  res.send('Check other routes!');
});

app.get('/scrape', async (req, res) => {
  const changes = await analyzeChanges();
  res.json(changes);
});

cron.schedule('* 1 * * *', async () => {
  console.log('Running scheduled task...');
  const changes = await analyzeChanges();
  console.log('Added cars:', changes.addedCars);
  console.log('Removed cars:', changes.removedCars);
});

app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
