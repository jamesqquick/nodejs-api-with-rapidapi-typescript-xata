import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getXataClient, Job } from './xata';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const xata = getXataClient();

app.get('/api/jobs', async (req: Request, res: Response) => {
  const jobs = await xata.db.job.getAll();
  res.json(jobs);
});

app.post('/api/jobs', async (req: Request, res: Response) => {
  const job = req.body;
  const createdJob = await xata.db.job.create(job);
  res.json(createdJob);
});

app.put('/api/jobs/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const job = req.body;
  const updatedJob = await xata.db.job.update(id, job);
  res.json(updatedJob);
});

app.delete('/api/jobs/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedRecord = await xata.db.job.delete(id);
  res.json(deletedRecord);
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
